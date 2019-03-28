import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  Toast,
} from 'native-base';
import { Auth } from '@cybavo/react-native-wallet-service';
import { fetchUserState } from '../store/actions';
import { colorPrimary } from '../Constants';
import ArrayPicker from '../components/ArrayPicker';
import InputPinCodeModal from '../components/InputPinCodeModal';
import { toastError } from '../Helpers';

const QUESTIONS = [
  'What was your childhood nickname?',
  'What is the name of your favorite childhood friend?',
  'In what city or town did your mother and father meet?',
  'What is the middle name of your oldest child?',
  'What is your favorite team?',
  'What is your favorite movie?',
  'What was your favorite sport in high school?',
  'What was your favorite food as a child?',
  'What is the first name of the boy or girl that you first kissed?',
  'What was the make and model of your first car?',
  'What was the name of the hospital where you were born?',
  'Who is your childhood sports hero?',
  'What school did you attend for sixth grade?',
  'What was the last name of your third grade teacher?',
  'In what town was your first job?',
  'What was the name of the company where you had your first job?',
];

class SetupSecurityQuestionsScreen extends Component {
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
          <Title style={{ color: colorPrimary }}>Setup security question</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params = {} },
      },
    } = this.props;
    const pinCode = params.pinCode || '';
    this.state = {
      loading: false,
      questions: [QUESTIONS[0], QUESTIONS[1], QUESTIONS[2]],
      answers: ['', '', ''],
      inputPinCode: false,
      pinCode,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { navigation, userState } = this.props;
    if (
      !prevProps.userState.setSecurityQuestions &&
      userState.setSecurityQuestions
    ) {
      Toast.show({ text: 'Setup security Questions successfully' });
      navigation.goBack();
    }
  };

  _getAvailableQuestions = index => {
    const { questions } = this.state;
    const others = questions.filter((_, i) => i !== index);
    return QUESTIONS.filter(q => !others.includes(q));
  };

  _setQuestion = (index, question) => {
    this.setState({
      questions: this.state.questions.map((q, i) =>
        i === index ? question : q
      ),
    });
  };

  _inputAnswer = (index, answer) => {
    const { answers } = this.state;
    this.setState({
      answers: answers.map((ans, i) => (i === index ? answer : ans)),
    });
  };

  _inputPinCode = () => {
    this.setState({ inputPinCode: true });
  };

  _finishInputPinCode = () => {
    this.setState({ inputPinCode: false });
  };

  _submit = () => {
    const { pinCode } = this.state;
    if (pinCode) {
      this._setupSecurityQuestions(pinCode);
    } else {
      this._inputPinCode();
    }
  };

  _setupSecurityQuestions = async pinCode => {
    this._finishInputPinCode();
    const { fetchUserState } = this.props;
    const { questions, answers } = this.state;
    this.setState({ loading: true });
    try {
      await Auth.setupBackupChallenge(
        pinCode,
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
    } catch (error) {
      console.warn('_setupSecurityQuestions failed', error);
      toastError(error);
    }
    await fetchUserState();
    this.setState({ loading: false });
  };

  render() {
    const { loading, questions, answers, inputPinCode } = this.state;
    const isValid = !answers.includes('');
    return (
      <Container style={{ padding: 16 }}>
        <Content>
          <Form>
            <Text
              style={{
                color: colorPrimary,
                fontSize: 32,
                marginBottom: 16,
              }}
            >
              {`Setup\nSecurity questions`}
            </Text>

            {[0, 1, 2].map(i => (
              <React.Fragment key={i}>
                <View style={{ flexDirection: 'row' }}>
                  <Badge primary style={{ alignSelf: 'center' }}>
                    <Text>{i + 1}</Text>
                  </Badge>
                  <ArrayPicker
                    options={this._getAvailableQuestions(i)}
                    selected={questions[i]}
                    onValueChange={q => this._setQuestion(i, q)}
                  />
                </View>
                <Item style={{ marginLeft: 32 }}>
                  <Input
                    editable={!loading}
                    placeholder="Your answer…"
                    value={answers[i]}
                    onChangeText={a => this._inputAnswer(i, a)}
                  />
                </Item>
              </React.Fragment>
            ))}
          </Form>
        </Content>
        <Button full disabled={loading || !isValid} onPress={this._submit}>
          <Text>Submit</Text>
        </Button>

        <InputPinCodeModal
          isVisible={inputPinCode}
          onCancel={() => {
            this._finishInputPinCode();
          }}
          loading={loading}
          onInputPinCode={this._setupSecurityQuestions}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userState: state.user.userState,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchUserState: () => dispatch(fetchUserState()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupSecurityQuestionsScreen);
