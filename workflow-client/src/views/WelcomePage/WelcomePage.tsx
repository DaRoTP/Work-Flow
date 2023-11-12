import React from "react";

import { ReactComponent as TaskColumns } from "@/assets/images/task_columns.svg";
import { ReactComponent as TaskColumnsDark } from "@/assets/images/task_columns_dark.svg";
import { ReactComponent as Person } from "@/assets/images/workflow-person.svg";
import { ReactComponent as PersonDark } from "@/assets/images/workflow-person_dark.svg";
import { useNavigate } from "react-router-dom";

import useAppTheme from "@/hooks/useAppTheme";

import "./WelcomePage.scss";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { themeState } = useAppTheme();

  const openRegisterModal = () => {
    navigate("/register");
  };

  return (
    <div className="welcome-section">
      <section className="welcome-section__introduction">
        {themeState ? (
          <PersonDark role="presentation" name="person_task_board" className="person-image" />
        ) : (
          <Person role="presentation" name="person_task_board" className="person-image" />
        )}

        <div className="welcome-section__introduction__text-subsection">
          <h1>Work-Flow</h1>
          <hr className="line-break" />
          <h2>work more collaboratively and get more done.</h2>
          <p>
            Work-Flow is a web-based Kanban-style list making application used to manage work at
            personal or organizational level. Using this application organizing your work will be
            easy!!
          </p>
          <button onClick={openRegisterModal} className="btn--glow join-now">
            Join us Now
          </button>
        </div>
      </section>
      <section className="welcome-section__explainer">
        <div className="welcome-section__explainer__text-subsection">
          <h2>Tasks</h2>
          <ul>
            <li>Create tasks</li>
            <li>Assign them to your teammates</li>
            <li>Add custom tags to differentiate tasks at a glance</li>
            <li>Enjoy a smooth and organized workflow</li>
          </ul>
        </div>
        {themeState ? (
          <TaskColumnsDark className="task-columns-image" />
        ) : (
          <TaskColumns className="task-columns-image" />
        )}
      </section>
    </div>
  );
};

export default WelcomePage;