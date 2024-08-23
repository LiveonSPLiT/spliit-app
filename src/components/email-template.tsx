import { Heading } from '@react-email/heading'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import { Text } from '@react-email/text'
import { Body } from '@react-email/body'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Hr } from '@react-email/hr'
import { Img } from '@react-email/img'
import { Link } from '@react-email/link'
import { Section } from '@react-email/section'
import { Button } from '@react-email/button'
import * as React from "react";

interface EmailTemplateProps {
    emailPreview: string;
    emailTitle?: string;
    emailMessage?: string;
    isButtonVisible?: boolean;
    emailButtonHeaderText?: string;
    emailButtonLable?: string;
    emailButtonLink?: string;
    emailButtonFooterText?: string;
    extraInformation?: string;
}

export function EmailTemplate ({ emailPreview,
    emailTitle, isButtonVisible, emailButtonHeaderText, emailButtonLable,
    emailMessage, emailButtonLink, emailButtonFooterText, extraInformation
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Email Notification {emailPreview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src="/logo-with-text.png"
                alt="SPLiT's Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>{emailTitle}</Heading>
              <Text style={mainText}>
                <>{emailMessage}</>
              </Text>
              { (isButtonVisible) ?
                <Section style={verificationSection}>
                        <Text style={verifyText}>{emailButtonHeaderText}</Text>
                        <Section style={buttonContainer}>
                            <Button href={emailButtonLink} style={button}>
                            {emailButtonLable}
                            </Button>
                        </Section>
                        <Text style={validityText}>
                        ({emailButtonFooterText})
                        </Text>
                </Section>
              : <Text style={codeText}>{extraInformation}</Text>
                }
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                SPLit will never email you and ask you to disclose
                or verify your password, credit card, or banking account number.
              </Text>
            </Section>
          </Section>
          <Text style={footerText}>
            This message was produced and distributed by SPLiT App,
            Pune, MH-IN.<br /> © 2024, SPLit. All rights reserved.
            Visit SPLiT at{" "}
            <Link href="https://liveonsplit.com" target="_blank" style={link}>
              Liveonsplit.com
            </Link>
            . View our{" "}
            <Link href="https://liveonsplit.com/legal/privacy-policy" target="_blank" style={link}>
              privacy policy
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}


const main = {
  backgroundColor: "#505050",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#1c1917",
};

const h1 = {
  color: "#0bda99",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#db2777",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#fff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#08090d",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
};

const coverSection = { backgroundColor: "#0c0a09" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "36px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "0px",
  textAlign: "center" as const,
};

const verificationSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };

const buttonContainer = {
    margin: "10px auto",
    width: "auto",
  };
  
  const button = {
    backgroundColor: "#0bda99",
    borderRadius: "3px",
    fontWeight: "600",
    color: "#0c0a09",
    textAlign: "center" as const,
    padding: "12px 24px",
    margin: "0 auto",
  };