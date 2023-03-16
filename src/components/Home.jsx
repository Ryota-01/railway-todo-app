import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import { url } from "../const";
import "../css/home.scss";

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState("todo"); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== "undefined") {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };

  return (
    <div>
      <Header />
      <div className="wrapper">
        <main className="taskList">
          <p className="error-message">{errorMessage}</p>
          <div>
            <div className="list-header">
              <h2>リスト一覧</h2>
              <div className="list-menu">
                  <Link to="/list/new" className="link-btn">リスト新規作成</Link>
                  <Link to={`/lists/${selectListId}/edit`}  className="link-btn">
                    選択中のリストを編集
                  </Link>
              </div>
            </div>
            <ul className="list-tab" role="tablist">
              {lists.map((list, key) => {
                const isActive = list.id === selectListId;
                return (
                  <li
                    key={key}
                    className={`list-tab-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectList(list.id)}
                    role="presentation"
                    >
                    <button
                      className="list-tab-btn"
                      role="tab"
                      tabIndex="0"
                      aria-controls="panel1"
                    >
                    {list.title}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="tasks">
              <div className="tasks-header">
                <h2>タスク一覧</h2>
                <Link to="/task/new"  className="link-btn">タスク新規作成</Link>
              </div>
              <div className="display-select-wrapper">
                <select
                  onChange={handleIsDoneDisplayChange}
                  className="display-select"
                >
                  <option value="todo">未完了</option>
                  <option value="done">完了</option>
                </select>
              </div>
              <Tasks
                tasks={tasks}
                selectListId={selectListId}
                isDoneDisplay={isDoneDisplay}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// 表示するタスク
const Tasks = (props) => {

  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;

  if (isDoneDisplay == "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <Link
                to={`/lists/${selectListId}/tasks/${task.id}`}
                className="task-item-link"
              >
                {task.title}
                <br />
                {task.limit}
                <br />
                {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          ))}
      </ul>
    );
  }


  // const limit = tasks.map(function(e) {return e["limit"]});
  // console.log(limit);


  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        }).map((task, key) => {

          //設定した期日（ブラウザ表示用）
          const limit = new Date(task.limit).toLocaleString();

          //設定した期日を数値に変換
          const targetDate = new Date(limit).getTime()
          
          //残日数の計算
          const diffMSec = targetDate - Date.now();
          const diffDays = diffMSec / (1000 * 60 * 60 * 24) -1 ;
          const diffTimes = diffMSec / (1000 * 60 * 60) % 24 -1;
          const diffMinutes = diffMSec / (1000 * 60) % 60;
          const showDays = Math.ceil(diffDays);
          const showTimes = Math.ceil(diffTimes);
          const showMinutes = Math.ceil(diffMinutes);
        
          return (
          <li key={key} className="task-item">
            <Link
              to={`/lists/${selectListId}/tasks/${task.id}`}
              className="task-item-link"
            >
              <p className="title">{task.title}</p>
              <p className="status">{task.done ? "完了" : "未完了"}</p>
              <p className="limit">詳細：{task.detail}</p>
              <p className="limit">期限：{limit}（残り{showDays}日{showTimes}時間{showMinutes}分）</p>
              {/* <p className="limit">残り日数：{showDays}日と{showTimes}時間{showMinutes}分</p> */}
            </Link>
          </li>
        )})}
    </ul>
  );
};
