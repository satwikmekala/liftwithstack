# Frames for /science

Almost every figure on `/science` is drawn in code: the opening plate and zoom are in `lib/science/arm.ts`
and `lib/science/scene.ts`, and the diagrams are SVG in `components/science/`.

The one exception is the small arm beside the sarcomere in chapter 3: 28 WebP frames in
`public/science/curl` (the `s/` folder is the phone size). They were rendered offline with three.js:
`arm.js` poses the left arm of the **Écorché** model (github.com/Charleeh/ecorche) into a dumbbell curl.
To re-render, clone Écorché next to this folder as `ecorche/`, run `python3 serve.py <dir containing ecorche>`,
open `arm.html` in Chromium with WebGL, and call `window.shot(...)` for each elbow angle.

## Licence

Écorché is licensed CC BY-SA 4.0 and is based on BodyParts3D (© The Database Center for Life Science,
CC BY 4.0) and Z-Anatomy by Gauthier Kervyn (CC BY-SA 4.0). The frames in `public/science/curl` are adapted
from it and are shared under **CC BY-SA 4.0**; `public/science/curl/LICENSE.txt` travels with them and the
page credits them. The scripts in this folder are ours.
