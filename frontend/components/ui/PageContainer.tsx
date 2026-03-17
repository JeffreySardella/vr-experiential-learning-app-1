import { Container, ContainerProps } from "@mui/material";

export default function PageContainer({ sx, children, ...props }: ContainerProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "calc(100vh - 64px)", ...sx }} {...props}>
      {children}
    </Container>
  );
}
