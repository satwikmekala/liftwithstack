# Frames for /science

The anatomical figure and the zoom on `/science` are image sequences rendered offline with three.js.
The browser never loads a 3D model.

- `arm.js` poses the left arm of the **Écorché** model (github.com/Charleeh/ecorche) into a dumbbell curl,
  curls the fingers around a modelled 10 kg dumbbell, and can fade everything but the biceps.
- `zoom.js` is an original procedural scene: biceps, fascicle, muscle fiber, myofibril, sarcomere,
  actin and myosin, laid out along one axis so one camera move passes through all of them.

To re-render: clone Écorché next to this folder as `ecorche/`, run `python3 serve.py <dir containing ecorche>`
(it serves `three` from this repo's `node_modules`), open `arm.html` or `zoom.html` in Chromium with WebGL,
and call `window.shot(...)` or `window.frame(t)` for each frame. Frames are saved as 1000 px and 640 px WebP
in `public/science/arm` and `public/science/zoom` (the `s/` folders are the phone size).

## Licence

Écorché is licensed CC BY-SA 4.0 and is based on BodyParts3D (© The Database Center for Life Science,
CC BY 4.0) and Z-Anatomy by Gauthier Kervyn (CC BY-SA 4.0). The frames in `public/science/arm` are adapted
from it and are shared under **CC BY-SA 4.0**. The page credits this in its Credits section. The scripts in
this folder are ours.
