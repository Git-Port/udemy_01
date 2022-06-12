import {createContext, useState} from 'react';

export const StateContext = createContext();

export default function StateContextProvider(props) {

  // 共有したい値を定義
  const [selectedTask, setSelectedTask] = useState({id: 0, title: ''});

  // 上記で定義した値をvalueに設定する
  return (<StateContext.Provider
      value={{
        selectedTask, setSelectedTask,
      }}
  >
    {/* children には別コンポーネントが入る / 別コンポーネントでimportし、ラッピングする */}
    {props.children}
  </StateContext.Provider>);

}
