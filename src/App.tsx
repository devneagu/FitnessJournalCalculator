import { ReducerAction, useEffect, useReducer } from "react";
import "./styles.css";

interface IFitnessData {
  weight : number,
  weightType : string,
  bodyFat : number,
  burnCalories : number,
  consumedCalories : number
}

function reducerFitness(state:IFitnessData,action){
  switch(action.type){
    case "weight":
      return {
        ...state,
        weight : parseInt(action.value)
      }
    case "weightType":
      return {
        ...state,
        weightType : action.value
      }
    case "bodyFat":
      return {
        ...state,
        bodyFat : parseInt(action.value)
      }
    case "burnCalories":
      return {
        ...state,
        burnCalories : parseInt(action.value)
      }
    case "consumedCalories":
      return {
        ...state,
         consumedCalories : parseInt(action.value)
      }
    default : 
      return {...state}
  }
}

function CalculateEngine(state : IFitnessData){
  const fat = state.weight*state.bodyFat/100;
  const muscle = state.weight - fat;

  const proteinTake : number = muscle*2.2;//take from table;
  const fatTake : number =  muscle * 1;

  const proteinTakeCalories = proteinTake*4;
  const fatTakeCalories = fatTake*9;
  const limit = state.consumedCalories - state.burnCalories;

  const carbTakeCalories =  1500 - proteinTakeCalories - fatTakeCalories;
  const carbTake = carbTakeCalories/4;

  return {
    limit,
    fat,
    muscle,
    proteinTake,
    fatTake,
    carbTake,
    proteinTakeCalories,
    fatTakeCalories,
    carbTakeCalories
  }
}

function reducerResults(state,action){
  switch(action.type){
    case "update" : 
      return {...action.value}
    default :
      return {...state}
  }
}


function FitnessJournal() {
  const initialState :  IFitnessData = {
    weight : null,
    weightType : "Kg",
    bodyFat : null,
    burnCalories : null,
    consumedCalories : null
  }
  
  const [fitnessData : unknown,dispatch] = useReducer(reducerFitness,initialState);
  const [fitnessResults: unknown,dispatchResults ] = useReducer(reducerResults,{});
  useEffect(()=> {
    console.log('update ',fitnessData);
  },[fitnessData])

  const eventHandler = () => {
    var obj = CalculateEngine(fitnessData);
    dispatchResults({type:'update',value:obj})
  }

  return (
    <>
      <div>
      <label htmlFor="weight">What is your weight?</label>
      <input type="number" id="weight" value={initialState.weight} onChange={(e) => dispatch({type:"weight",value : e.target.value})} />
      </div>

      <div>
      <label htmlFor="bodyFat">What is your body fat(%)?</label>
      <input type="number" id="bodyFat" value={initialState.bodyFat} onChange={(e) => dispatch({type:"bodyFat",value : e.target.value})} />
      </div>
      <div>
      <label htmlFor="burnCalories">What is your calories burn per day?</label>
      <input type="number" id="burnCalories" value={initialState.burnCalories} onChange={(e) => dispatch({type:"burnCalories",value : e.target.value})} />
      </div>
      <div>
      <label htmlFor="consumedCalories">What is your consumed calories?</label>
      <input type="number" id="consumedCalories" value={initialState.consumedCalories} onChange={(e) => dispatch({type:"consumedCalories",value : e.target.value})} />
      </div>
      <button onClick={eventHandler}>Submit</button>
      <pre>
        {JSON.stringify(fitnessResults,null,2)}
      </pre>
    </>
  )
}

export default function App() {
  return (
    <div className="App">
      <FitnessJournal />
    </div>
  );
}
