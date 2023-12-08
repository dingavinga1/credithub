import {Row, Card, Button, Form, Input, Popconfirm, Select, Typography, message } from "antd";
import Layout from "antd/es/layout/layout";
import React, { useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;

const Deposit = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const {
    state: { contract, accounts },
  } = useEth();



  const onFinish = async (values) => {
    try {
        const account = localStorage.getItem('publicKey');
        await contract.methods
          .deposit()
          .send({ from: account, value: values.amount });
        message.success("Deposit successful!");
        navigate('/profile');
    } catch (err) {
        message.destroy();
        message.error(err.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: "2vh" }}>
      <Title>Deposit</Title>
      <Card>
        <Form onFinish={onFinish} form={form} >
            <Form.Item
            label="Amount"
            name="amount"
            rules={[
                {
                required: true,
                message: "Please enter an amount!",
                },
            ]}
            >
            <Input type="number" min={0} />
            </Form.Item>

            <Popconfirm
                title={`Are you sure you want to deposit ${form.values?.amount}?`}
                onConfirm={form.submit}
                okText="Yes"
                cancelText="No"
            >
                <Button type="primary">
                Deposit
                </Button>
            </Popconfirm>
        </Form>
      </Card>
    </Layout>
  );
};
export default Deposit;
