/*
register('command', () => {
  sleep(1000, () => {
    ChatLib.chat("Hello World");
  });
}).setName("examplecommand")
*/

export default function sleep(timeout, codez) {
  let willFire = 0;
  let st = register('step', () => {
    if (willFire !== 1) {
      willFire++;
    } else {
      codez();
      willFire = 2;
      st.unregister();
    }
  })
  if (timeout < 1000) {
    st.setFps(1000.0 / parseFloat(timeout))
  } else {
    st.setDelay(parseFloat(timeout) / 1000.0)
  }
}