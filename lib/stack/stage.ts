/**
 * A small three.js stage for Your Stack: the app's fixed orthographic view (8, 6, 10),
 * unlit vertex-coloured blocks and the two-step plinth. Callers decide what moves.
 */
import {
  BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial, OrthographicCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer,
} from "three";
import { createSlabGeometry } from "./geometry";
import { DEFAULT_TUNING, type BuildSlab } from "./model";

export type StageItem = {
  slab: BuildSlab;
  y: number;
  /** Extra vertical offset, for drops and lifts. */
  dy?: number;
  scaleY?: number;
  visible?: boolean;
};

import type { Frame } from "./motion";

export class Stage {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
  private material = new MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  private meshes = new Map<string, Mesh>();
  private geometries = new Map<string, BufferGeometry>();
  private raycaster = new Raycaster();
  private target = new Vector3();
  private width = 1;
  private height = 1;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    const plinth = new Mesh(new BoxGeometry(2.22, 0.15, 2.22), new MeshBasicMaterial({ color: "#51483A" }));
    const foot = new Mesh(new BoxGeometry(2.36, 0.075, 2.36), new MeshBasicMaterial({ color: "#29231B" }));
    foot.position.y = -0.11;
    this.scene.add(plinth, foot);
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.setSize(this.width, this.height, false);
    Object.assign(this.camera, { left: -this.width / 2, right: this.width / 2, top: this.height / 2, bottom: -this.height / 2 });
  }

  get size() {
    return { width: this.width, height: this.height };
  }

  private geometryFor(slab: BuildSlab) {
    const key = `${slab.id}:${slab.height}:${slab.layers.length}`;
    let geometry = this.geometries.get(key);
    if (!geometry) {
      geometry = createSlabGeometry(slab, DEFAULT_TUNING);
      this.geometries.set(key, geometry);
    }
    return geometry;
  }

  sync(items: readonly StageItem[]) {
    const seen = new Set<string>();
    for (const item of items) {
      seen.add(item.slab.id);
      let mesh = this.meshes.get(item.slab.id);
      const geometry = this.geometryFor(item.slab);
      if (!mesh) {
        mesh = new Mesh(geometry, this.material);
        mesh.userData.id = item.slab.id;
        this.meshes.set(item.slab.id, mesh);
        this.scene.add(mesh);
      } else if (mesh.geometry !== geometry) {
        mesh.geometry = geometry;
      }
      mesh.position.y = item.y + (item.dy ?? 0);
      mesh.scale.y = item.scaleY ?? 1;
      mesh.visible = item.visible ?? true;
    }
    for (const [id, mesh] of this.meshes) if (!seen.has(id)) mesh.visible = false;
  }

  render(frame: Frame, top: number) {
    const distance = Math.max(1, top / 10);
    this.target.set(0, frame.targetY, 0);
    this.camera.zoom = frame.zoom;
    this.camera.position.set(8 * distance, frame.targetY + 6 * distance, 10 * distance);
    this.camera.lookAt(this.target);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
  }

  /** The block under a point in canvas pixels, if any. */
  pick(x: number, y: number): string | null {
    const pointer = new Vector2((x / this.width) * 2 - 1, -(y / this.height) * 2 + 1);
    this.raycaster.setFromCamera(pointer, this.camera);
    const hit = this.raycaster.intersectObjects([...this.meshes.values()].filter((mesh) => mesh.visible), false)[0];
    return (hit?.object.userData.id as string | undefined) ?? null;
  }

  /** Canvas-pixel position of a height on the tower's left-most edge, as the app's ruler uses. */
  project(y: number) {
    const point = new Vector3(-1, y, 1).project(this.camera);
    return { x: ((point.x + 1) * this.width) / 2, y: ((1 - point.y) * this.height) / 2 };
  }

  dispose() {
    this.geometries.forEach((geometry) => geometry.dispose());
    this.material.dispose();
    this.renderer.dispose();
  }
}
