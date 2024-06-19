import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";

export default function tokenTemplate(token) {

  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Tentativo di accesso a Weekly Planner </Text>
          <Text style={paragraph}>Token di accesso : {token}</Text>
          <br/>
          <Text style={paragraph}>Conserva con cura il token e non rivelarlo a nessuno. </Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};