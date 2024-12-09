import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Link,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  username: string;
  url: string;
}

export default function ResetPasswordEmail({ username, url }: ResetPasswordEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Your Password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reset Your Password</Preview>
      <Section style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <Row>
          <Heading
            as="h2"
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px',
            }}
          >
            Hello {username},
          </Heading>
        </Row>
        <Row>
          <Text style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
            We received a request to reset your password. Please click the button below to complete the process:
          </Text>
        </Row>
        <Row style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link
            href={url}
            style={{
              display: 'inline-block',
              backgroundColor: '#4CAF50',
              color: '#fff',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Reset Password
          </Link>
        </Row>
        <Row>
          <Text style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginTop: '20px' }}>
            If you did not request this password reset, please ignore this email or contact our support team.
          </Text>
        </Row>
        <Row>
          <Text
            style={{
              fontSize: '12px',
              color: '#999',
              marginTop: '10px',
              textAlign: 'center',
            }}
          >
            Note: This link is valid for 15 minutes.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
