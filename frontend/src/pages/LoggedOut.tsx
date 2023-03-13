import { useState } from "react";
import { Container } from "react-bootstrap";
import LoginModal from "../components/LoggedOut/LoginModal";
import SignUpModal from "../components/LoggedOut/SignUpModal";
import NavBar from "../components/NavBar/NavBar";
import { User } from "../models/user";
import styleUtils from '../styles/utils.module.css';

interface LoggedOutProps {
  setLoggedInUser: (user: User | null) => void
}

const LoggedOut = ({ setLoggedInUser }: LoggedOutProps) => {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);


  return (
    <>
      <NavBar
        loggedInUser={null}
        onLoginClicked={() => setShowLoginModal(true)}
        onSignUpClicked={() => setShowSignUpModal(true)}
      />
      <Container className={styleUtils.pageContainer}>
        <p className={styleUtils.flexCenter}>Login to start creating Todos!</p>
      </Container>
      {showSignUpModal &&
        <SignUpModal
          onDismiss={() => setShowSignUpModal(false)}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user);
            setShowSignUpModal(false);
          }}
        />
      }
      {showLoginModal &&
        <LoginModal
          onDismiss={() => setShowLoginModal(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLoginModal(false);
          }}
        />
      }
    </>
  );
}

export default LoggedOut;