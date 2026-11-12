"""Packs the app's Body Map figure (assets/body-map/body-sculpt.glb) for the web.

The GLB has one primitive per Stack region plus `neutral`. This writes public/app/body.bin:
  "SBM1" · uint32 header length · JSON header · uint16 positions (quantized to the bounds)
  · int8 normals · uint16 indices (each part's are relative to its first vertex).
Usage: python3 tools/body-model/build.py <path to body-sculpt.glb>
"""
import json, struct, sys
import numpy as np

src = sys.argv[1]
data = open(src, "rb").read()
json_len = struct.unpack("<I", data[12:16])[0]
gltf = json.loads(data[20:20 + json_len])
bin_start = 20 + json_len + 8

def read(index, dtype, width):
    accessor = gltf["accessors"][index]
    view = gltf["bufferViews"][accessor["bufferView"]]
    offset = bin_start + view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    return np.frombuffer(data, dtype=dtype, count=accessor["count"] * width, offset=offset).reshape(-1, width)

parts, positions, normals, indices = [], [], [], []
v_start = i_start = 0
for primitive in gltf["meshes"][0]["primitives"]:
    name = gltf["materials"][primitive["material"]]["name"]
    p = read(primitive["attributes"]["POSITION"], "<f4", 3)
    n = read(primitive["attributes"]["NORMAL"], "<f4", 3)
    assert gltf["accessors"][primitive["indices"]]["componentType"] == 5123 and len(p) < 65536
    i = read(primitive["indices"], "<u2", 1).ravel()
    parts.append({"name": name, "vStart": v_start, "vCount": len(p), "iStart": i_start, "iCount": len(i)})
    positions.append(p); normals.append(n); indices.append(i)
    v_start += len(p); i_start += len(i)

positions = np.concatenate(positions); normals = np.concatenate(normals); indices = np.concatenate(indices)
lo, hi = positions.min(axis=0), positions.max(axis=0)
quantized = np.round((positions - lo) / (hi - lo) * 65535).astype("<u2")
packed_normals = np.round(np.clip(normals, -1, 1) * 127).astype("i1")
header = json.dumps({"count": int(v_start), "indexCount": int(i_start), "min": lo.tolist(), "max": hi.tolist(), "parts": parts}).encode()
header += b" " * (-(8 + len(header)) % 4)
body = quantized.tobytes() + packed_normals.tobytes()
body += b"\0" * (-len(body) % 2)
out = b"SBM1" + struct.pack("<I", len(header)) + header + body + indices.astype("<u2").tobytes()
open("public/app/body.bin", "wb").write(out)
print(f"{v_start} vertices, {i_start} indices, {len(out) / 1e6:.2f} MB")
