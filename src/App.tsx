import TaskList from "./components/TaskList";
import './App.css';
import TaskForm from "./components/TaskForm";

const App: React.FC = () => {   
        return (
        <div className="flex flex-row ">
                <TaskForm/>
              <TaskList />
        </div>
        );
        }

export default App;