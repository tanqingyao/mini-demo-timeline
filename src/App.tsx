import { Tracks } from './Tracks';
import { dragHandler } from './Tracks/dnd';
import { ActionType, actionsReducer } from './Tracks/store';
import { ColorMap, generateClickMaterial } from './Tracks/utils';

function App() {
  return (
    <div>
      <div style={{ margin: 20 }}>
        <h2>add material</h2>
        <button
          draggable
          style={{ background: ColorMap.Video }}
          onClick={() =>
            actionsReducer(
              ActionType.ClickMaterial,
              generateClickMaterial('video')
            )
          }
          onDragStart={() => {
            dragHandler().setDragInfo('video');
          }}
        >
          click or drag
        </button>
        <button
          draggable
          style={{ background: ColorMap.Text }}
          onClick={() =>
            actionsReducer(
              ActionType.ClickMaterial,
              generateClickMaterial('text')
            )
          }
          onDragStart={() => {
            dragHandler().setDragInfo('text');
          }}
        >
          click or drag
        </button>
      </div>
      <Tracks></Tracks>
    </div>
  );
}

export default App;
