import { useOptionalUser } from "~/utils";
import { Button, Container, Title } from "@mantine/core";
import { Link } from "@remix-run/react";

export default function Index() {
  const user = useOptionalUser();

  return (
    <Container>
      <Title order={3} size="h1">
        Hello monkey 🐒
      </Title>
      {user ? (
        <Button component={Link} to="/join">
          View Notes for {user.email}
        </Button>
      ) : (
        <>
          <Button component={Link} to="/join">
            Sign up
          </Button>
          <Button component={Link} to="/login">
            Log In
          </Button>
        </>
      )}
    </Container>
  );
}
