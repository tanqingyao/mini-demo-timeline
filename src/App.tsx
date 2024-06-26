import { Tracks } from './Tracks';
import { ActionType, actionsReducer } from './Tracks/store';
import { ColorMap, generateClickMaterial } from './Tracks/utils';

function App() {
  return (
    <div>
      <div style={{ margin: 20 }}>
        <h2>add material</h2>
        <button
          style={{ background: ColorMap.Video }}
          onClick={() =>
            actionsReducer(
              ActionType.ClickMaterial,
              generateClickMaterial('video')
            )
          }
        >
          click or drag
        </button>
        <button
          style={{ background: ColorMap.Text }}
          onClick={() =>
            actionsReducer(
              ActionType.ClickMaterial,
              generateClickMaterial('text')
            )
          }
        >
          click or drag
        </button>
      </div>
      <Tracks></Tracks>
    </div>
  );
}

export default App;
