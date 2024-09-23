import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner, Container, Row, Col, Form, Button } from "react-bootstrap";
import { useCurrencyConverterStore } from "../store";
import CurrencyConverterApi from "../services/api";

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const { history, addConversion } = useCurrencyConverterStore();

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await CurrencyConverterApi.getCurrencies();
        const currencyArray = Object.keys(response).map((key) => {
          const { name, ...value } = response[key];
          return { label: name, value: value?.code };
        });
        setCurrencies(currencyArray);
      } catch (error) {
        console.error("Error fetching currencies");
      }
    };
    fetchCurrencies();
  }, []);

  const formik = useFormik({
    initialValues: {
      from: "",
      to: "",
      amount: "",
    },
    validationSchema: Yup.object({
      from: Yup.string().required('Please select a "from" currency'),
      to: Yup.string().required('Please select a "to" currency'),
      amount: Yup.number()
        .positive("Amount must be positive")
        .required("Amount is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await CurrencyConverterApi.postCurrency({
          from: values.from,
          to: values.to,
          amount: Number(values.amount),
        });
        const { from, to, amount, result } = response;
        addConversion({
          from: from,
          to: to,
          amount: parseFloat(amount),
          result,
          date: new Date().toLocaleString(),
        });
        setConvertedAmount(result);
        formik.resetForm();
      } catch (error) {
        console.error("Conversion error", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center flex-column min-vh-100 w-100">
      <h1>Currency Converter</h1>
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="from">
              <Form.Label>From</Form.Label>
              <Form.Control
                as="select"
                {...formik.getFieldProps("from")}
                isInvalid={formik.touched.from && !!formik.errors.from}
              >
                <option value="">Select currency</option>
                {currencies.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.from}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="to">
              <Form.Label>To</Form.Label>
              <Form.Control
                as="select"
                {...formik.getFieldProps("to")}
                isInvalid={formik.touched.to && !!formik.errors.to}
              >
                <option value="">Select currency</option>
                {currencies.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.to}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            {...formik.getFieldProps("amount")}
            isInvalid={formik.touched.amount && !!formik.errors.amount}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.amount}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          type="submit"
          className="mt-3"
          disabled={loading || !formik.isValid}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Convert"}
        </Button>
      </Form>

      {convertedAmount !== null && (
        <div className="mt-3">
          <h2>Converted Amount: {convertedAmount.toFixed(2)}</h2>
        </div>
      )}

      <h3 className="mt-4">Conversion History</h3>
      <ol>
        {history.map((conversion, index) => (
          <li key={index}>
            {conversion.amount} {conversion.from} ={" "}
            {conversion.result.toFixed(2)} {conversion.to} at {conversion.date}
          </li>
        ))}
      </ol>
    </Container>
  );
};

export default CurrencyConverter;
