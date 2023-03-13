import { useState } from 'react';
import { Alert, Button, Form, Modal, ModalHeader } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { UnauthorizedError } from '../../errors/http_errors';
import { User } from "../../models/user";
import * as UsersApi from "../../network/users_api";
import { LoginCredentials } from "../../network/users_api";
import styleUtils from '../../styles/utils.module.css';
import TextInputField from "../form/TextInputField";

interface LoginModalProps {
  onDismiss: () => void,
  onLoginSuccessful: (user: User) => void
}

const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await UsersApi.login(credentials);
      onLoginSuccessful(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) setErrorText(error.message);
      console.error(error)
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <ModalHeader closeButton>
        <Modal.Title>
          Login
        </Modal.Title>
      </ModalHeader>

      <Modal.Body>
        {errorText &&
          <Alert variant="danger">
            {errorText}
          </Alert>
        }
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            type="text"
            placeholder="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.username}
          />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styleUtils.width100}
          >
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;