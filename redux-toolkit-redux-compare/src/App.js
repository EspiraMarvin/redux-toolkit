import React from "react";
import "./App.css";

import { useSelector, useDispatch } from "react-redux"
// import { Increase, Decrease } from "./redux/action"
import { increment, incrementByAmount, decrement } from "./tookit/reducer"

function App() {

  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className="App">
      <h1>Redux Toolkit</h1>
      <button onClick={() => dispatch(incrementByAmount(5))}>Increment</button>
      <span>{ count }</span>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default App;
