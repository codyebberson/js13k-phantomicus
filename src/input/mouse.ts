export type {};

// export const mouse = {
//   /** Mouse x coordinate. */
//   x: 0,

//   /** Mouse y coordinate. */
//   y: 0,

//   /** Mouse buttons. */
//   buttons: new InputSet(),

//   event: undefined as MouseEvent | WheelEvent | undefined,

//   movementX: 0,

//   movementY: 0,

//   zoom: 1,

//   sensitivity: 0.005,
// };

// /**
//  * Updates all mouse button states.
//  */
// export const updateMouse = (): void  => {
//   // mouse.moved = false;
//   mouse.movementX = 0;
//   mouse.movementY = 0;
//   mouse.zoom = 1;

//   if (mouse.event) {
//     mouse.movementX = mouse.event.movementX;
//     mouse.movementY = mouse.event.movementY;
//     // mouse.zoom = (mouse.event as WheelEvent).deltaY;
//     // scaleY = clamp(1.0, 4.0, scaleY / 1.001 ** e.deltaY);
//     if (mouse.event instanceof WheelEvent) {
//       mouse.zoom = 1.001 ** (mouse.event as WheelEvent).deltaY;
//     }
//     mouse.event = undefined;
//   }
//   mouse.buttons.updateAll();
// }

// document.body.addEventListener('contextmenu', (e) => {
//   killEvent(e);
// });

// overlayCanvas.addEventListener('contextmenu', (e) => {
//   killEvent(e);
// });

// overlayCanvas.addEventListener('wheel', (e) => {
//   killEvent(e);
//   mouse.event = e;
// });

// overlayCanvas.addEventListener('mousedown', (e) => {
//   killEvent(e);
//   mouse.buttons.get(e.button).down = true;
//   // document.body.dataset['m'] = 't';

//   const handleMouseMove = (e: MouseEvent): void  => {
//     const canvasRect = overlayCanvas.getBoundingClientRect();
//     mouse.event = e;
//     mouse.x = ((e.clientX - canvasRect.left) / overlayCanvas.offsetWidth) * WIDTH;
//     mouse.y = ((e.clientY - canvasRect.top) / overlayCanvas.offsetHeight) * HEIGHT;
//   }

//   const handleMouseUp = (e: MouseEvent): void  => {
//     killEvent(e);
//     mouse.buttons.get(e.button).down = false;
//     // document.body.dataset['m'] = 'f';

//     document.removeEventListener('mousemove', handleMouseMove, true);
//     document.removeEventListener('mouseup', handleMouseUp, true);
//   }

//   document.addEventListener('mousemove', handleMouseMove, true);
//   document.addEventListener('mouseup', handleMouseUp, true);
// });

// overlayCanvas.addEventListener('mouseup', (e) => {
//   killEvent(e);
//   mouse.buttons.get(e.button).down = false;
//   overlayCanvas.dataset['m'] = 'f';
// });

// overlayCanvas.addEventListener('mousemove', (e) => {
//   const canvasRect = overlayCanvas.getBoundingClientRect();
//   mouse.event = e;
//   mouse.x = ((e.clientX - canvasRect.left) / overlayCanvas.offsetWidth) * WIDTH;
//   mouse.y = ((e.clientY - canvasRect.top) / overlayCanvas.offsetHeight) * HEIGHT;
// });
