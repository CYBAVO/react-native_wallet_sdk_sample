/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Container,
  Content,
  Button,
  Form,
  Text,
  Item,
  Input,
  Badge,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
} from 'native-base';
import { Auth } from '@cybavo/react-native-wallet-service';
import { colorPrimary } from '../Constants';
import { toastError } from '../Helpers';

class VerifySecurityQuestionsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header
        noShadow
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{ color: colorPrimary }} />
          </Button>
        </Left>
        <Body>
          <Title style={{ color: colorPrimary }}>Restore PIN code</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      questions: ['', '', ''],
      answers: ['', '', ''],
    };
  }

  componentDidMount = () => {
    this._fetchSecurityQuestions();
  };

  _fetchSecurityQuestions = async () => {
    this.setState({ loading: true });
    try {
      const {
        question1,
        question2,
        question3,
      } = await Auth.getRestoreQuestions();
      this.setState({
        questions: [question1, question2, question3],
      });
    } catch (error) {
      console.log('_fetchSecurityQuestions failed', error);
      toastError(error);
    }
    this.setState({ loading: false });
  };

  _inputAnswer = (index, answer) => {
    const { answers } = this.state;
    this.setState({
      answers: answers.map((ans, i) => (i === index ? answer : ans)),
    });
  };

  _verifyRestoreQuestions = async () => {
    const { questions, answers } = this.state;
    this.setState({ loading: true });
    try {
      await Auth.verifyRestoreQuestions(
        {
          question: questions[0],
          answer: answers[0],
        },
        {
          question: questions[1],
          answer: answers[1],
        },
        {
          question: questions[2],
          answer: answers[2],
        }
      );
      this._goRestorePinCode(questions, answers);
    } catch (error) {
      console.log('_verifyRestoreQuestions failed', error);
      toastError(error);
      this.setState({ loading: false });
    }
  };

  _goRestorePinCode(questions, answers) {
    const { navigation } = this.props;
    navigation.replace({
      routeName: 'RestorePinCode',
      params: {
        questions,
        answers,
      },
    });
  }

  _goRecoverPinCode = () => {
    const { navigation } = this.props;
    navigation.replace('RecoverPinCode');
  };

  render() {
    const { loading, questions, answers } = this.state;
    const isValid = !answers.includes('');
    return (
      <Container style={{ padding: 16 }}>
        <Content>
          <Text
            style={{
              color: colorPrimary,
              marginBottom: 16,
              fontSize: 20,
            }}
          >
            Fill in answers of your security questions to restore your PIN code
          </Text>
          <Form>
            {[0, 1, 2].map(i => (
              <React.Fragment key={i}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <Badge primary style={{ marginRight: 8 }}>
                    <Text>{i + 1}</Text>
                  </Badge>
                  <Text style={{ flex: 1 }}>{questions[i] || '…'}</Text>
                </View>
                <Item style={{ marginLeft: 32 }}>
                  <Input
                    editable={!loading}
                    placeholder="Your answer…"
                    value={answers[i]}
                    onChangeText={answer => this._inputAnswer(i, answer)}
                  />
                </Item>
              </React.Fragment>
            ))}
          </Form>
        </Content>

        <Button
          transparent
          full
          danger
          style={{
            marginVertical: 8,
          }}
          disabled={loading}
          onPress={this._goRecoverPinCode}
        >
          <Text>I Don't remember my answers…</Text>
        </Button>
        <Button
          full
          disabled={loading || !isValid}
          onPress={this._verifyRestoreQuestions}
        >
          <Text>Submit</Text>
        </Button>
      </Container>
    );
  }
}

export default VerifySecurityQuestionsScreen;
