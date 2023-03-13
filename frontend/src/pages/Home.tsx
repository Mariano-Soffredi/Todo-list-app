import { Container } from "react-bootstrap";
import TodosPageView from "../components/Home/TodosPageView";
import NavBar from "../components/NavBar/NavBar";
import { User } from "../models/user";
import styles from "../styles/Home.module.css";

interface TodosPageProps {
  loggedInUser: User | null,
  setLoggedInUser: (user: null) => void,
}

const TodosPage = ({ loggedInUser, setLoggedInUser }: TodosPageProps) => {
  return (
    <>
      <NavBar
        loggedInUser={loggedInUser}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />
      <Container className={`${styles.todosPage} ${styles.pageContainer}`} >
        <TodosPageView />
      </Container>
    </>
  );
}

export default TodosPage;