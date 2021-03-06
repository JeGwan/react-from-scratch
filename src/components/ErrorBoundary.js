import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log("π getDerivedStateFromError");
    // λ€μ λ λλ§μμ ν΄λ°± UIκ° λ³΄μ΄λλ‘ μνλ₯Ό μλ°μ΄νΈ ν©λλ€.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // μλ¬ λ¦¬ν¬ν μλΉμ€μ μλ¬λ₯Ό κΈ°λ‘ν  μλ μμ΅λλ€.
    console.log("π componentDidCatch", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // ν΄λ°± UIλ₯Ό μ»€μ€ννμ¬ λ λλ§ν  μ μμ΅λλ€.
      return <h1>π λ­μ μλͺ»λ κ² κ°μ π±</h1>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
