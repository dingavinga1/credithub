/* eslint-disable */

import {
  Row,
  Col,
  Card,
  message,
  Typography,
  Button,
  Popconfirm,
  Skeleton,
  Form,
  Input,
  useForm,
  Space
} from "antd";
import { useEffect, useState } from "react";
import { useEth } from "../../contexts/EthContext";

const { Title, Text } = Typography;

const Loan = () => {
    const [form] = Form.useForm();

  const {
    state: { contract },
  } = useEth();

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loanDetails, setLoanDetails] = useState(null);

  const getLoan = async (values) =>{
    try{
        const account = localStorage.getItem('publicKey');
        const hi = await contract.methods.getLoan(values.amount).send({from: account, gas: 3000000});
        console.log(hi);
        message.success("Loan requested successfully!");
    } catch(err){
        message.destroy();
        message.error(err.message.split('revert ')[1]);
    }
  }

  useEffect(() => {
    let accountId = localStorage.getItem("publicKey");
    let password = localStorage.getItem("password");

    if (contract) {
      const getLoanDetails = async () => {
        setLoading(true);
        try {
          const details = await contract.methods
            .getLoanStatus()
            .call({ from: accountId });
            console.log(details);
          setLoanDetails(details);

          console.log(details);
        } catch (err) {
          setLoanDetails(null);
        } finally {
          setLoading(false);
        }
      };

      const getDetails = async () => {
        setLoading(true);
        try {
          const details = await contract.methods
            .getUserBalance()
            .call({ from: accountId });
          setBalance(details);
          getLoanDetails();
        } catch (err) {
          message.destroy();
          message.error(err.message);
        } finally {
          setLoading(false);
        }
      };

      getDetails();
    }
  }, [contract]);

  return (
    <Row gutter={20}>
      <Col xs={20} xl={20}>
        <Card title="Request Loan" bordered={true}>
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              {loanDetails ? (
                <Text>You already have an active loan!</Text>
              ) : (
                <>
                  <Form form={form} onFinish={getLoan}>
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: "Please enter an amount!",
                            },
                            {
                                //max validation
                                validator: async (_, value) => {
                                    if (value > 50000000000000000000) {
                                        return Promise.reject(
                                            new Error("Amount cannot exceed 50 ether!")
                                        );
                                    }
                                }
                            }
                        ]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={50000000000000000000}
                      />
                    </Form.Item>

                    <Popconfirm
                        title={`Are you sure you want to request a loan?`}
                        onConfirm={form.submit}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary">Request</Button>
                    </Popconfirm>
                  </Form>
                </>
              )}
            </>
          )}
        </Card>
      </Col>

      <Col xs={20} xl={20}>
        <Card title="Repayment" bordered={true}>
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              {loanDetails ? (
                <>
                  <Title level={4}>Current Amount</Title>
                  <Text>{loanDetails[0]}</Text>

                  <Title level={4}>Time Elapsed</Title>
                  <Text>{loanDetails[1]}</Text>

                  <Row style={{marginBottom: 20}}></Row>

                  <Popconfirm
                    title={`Are you sure you want to repay your loan?`}
                    onConfirm={async () => {
                      if (balance < loanDetails[0]) {
                        message.destroy();
                        message.error(
                          "You do not have enough balance to repay your loan!"
                        );
                      } else {
                        setLoading(true);
                        try {
                          await contract.methods
                            .returnLoan()
                            .send({ from: localStorage.getItem("publicKey"), gas: 3000000 });
                          message.success("Loan repaid successfully!");
                        } catch (err) {
                          message.destroy();
                          message.error(err.message);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary">Repay</Button>
                  </Popconfirm>
                </>
              ) : (
                <Text level={1}>You do not have an active loan!</Text>
              )}
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default Loan;
