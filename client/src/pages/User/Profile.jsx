/* eslint-disable */

import { Row, Col, Card, message, Typography, Button, Popconfirm, Skeleton } from "antd"
import { useEffect, useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Profile = () => {
  const navigate = useNavigate();

    const { state:{ contract } } = useEth();

    const [balance, setBalance] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    const [loanDetails, setLoanDetails] = useState(null);

    useEffect(()=>{
        let accountId = localStorage.getItem("publicKey");
        let password = localStorage.getItem("password");

        if(contract){
            const getLoanDetails = async () => {
              setLoading(true);
              try {
                const details = await contract.methods
                  .getLoanStatus()
                  .call({ from: accountId });
                setLoanDetails(details);
              } catch (err) {
                setLoanDetails(null);
              } finally {
                setLoading(false);
              }
            };

            const getDetails = async () => {
              setLoading(true);
              try{
                const details = await contract.methods.getUserBalance().call({from: accountId});
                setBalance(details);
                setIsRegistered(true);
                getLoanDetails();
              }catch(err){
                navigate('/register');
                message.destroy();
                message.error("You have to register first!");

                setIsRegistered(false);
              } finally{
                setLoading(false);
              }

            }

            getDetails();
        }
    }, [contract]);

  return (
    <Row gutter={20}>
      <Col xs={20} xl={20}>
        <Card title="Account details" bordered={true}>
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <Title level={4}>Public Key</Title>
              <Text>{localStorage.getItem("publicKey") ?? ""}</Text>

              <Title level={4}>Balance</Title>
              <Text>{balance ?? ""} ether</Text>
            </>
          )}
        </Card>
      </Col>
      <Col xs={20} xl={20}>
        <Card title="Loan Status" bordered={true}>
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
}

export default Profile