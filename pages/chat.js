import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMDQwMywiZXhwIjoxOTU4ODg2NDAzfQ.3h_kReGvJMrRqTvte_CYkIHJSB05FPUy4Rhjok5HlvI';
const SUPABASE_URL = 'https://vwcaigmxumbdsdvdeygq.supabase.co';

// Create a single supabase client for interacting with your database
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listenMessagesRealTime(addNewMessage) {
  return supabaseClient
    .from('messages')
    .on('INSERT', (responseNewMessage) => {
      addNewMessage(responseNewMessage.new); //get the new message sent
    })
    .subscribe(); //function for supabase that listen if your table has a new record
  // you need to activate that feature in the supabase to work
}

export default function ChatPage() {

  const router = useRouter();
  const userLogIn = router.query.username;
  const [disableButton, setDisableButton] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(async () => {
    await supabaseClient //select messages stored in the supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMessages(data);
      })
    listenMessagesRealTime((newMessage) => {
      setMessages((listNow) => { //when you need to reuse before value(object/array)
        //you should a function inside the setState 
        return [
          newMessage, //recover the last message sent to update 'messages'
          ...listNow
        ] //update the messages with the new sent from supabase 
      });
    });
  }, []); //useEffect only run when the 'messages' update

  function handleNewMessage(newMessage) {
    const message = {
      text: newMessage,
      from: userLogIn,
      // id: messages.length + 1
    }

    supabaseClient
      .from('messages')
      .insert([
        message //insert the message in the supabase
      ])
      .then(({ data }) => {
        console.log(data);
      })

    setMessage('');
  }

  async function handleDeleteMessage(id) {
    await supabaseClient
      .from('messages') //delete the message from supabase
      .delete()
      .match({ id: id })
      .then(({ data }) => {
        console.log(data)
      })
    const newListMessage = messages.filter((message) => {
      return message.id != id //new list without id passed.
    });
    setMessages(newListMessage); //update list
  }
  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList messages={messages} handleDeleteMessage={handleDeleteMessage} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              value={message}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 0) {
                  setDisableButton(false);
                } else {
                  setDisableButton(true);
                }
                setMessage(value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); //remove default action from enter
                  if (message.length > 0) {
                    handleNewMessage(message); // add the text typed in messages
                    setDisableButton(true);
                  }
                }
              }}
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker onStickerClick={(sticker) => {
              handleNewMessage(`:sticker:${sticker}`)
            }} />
            <Button
              label='Enviar'
              onClick={(e) => {
                handleNewMessage(message);
                setDisableButton(true);
              }}
              disabled={disableButton}
              fullWidth
              styleSheet={{
                maxWidth: '100px',
                padding: '13px',
                marginBottom: '8px',
                marginLeft: '8px'
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          onClick={() => {
            router.push('/');
          }}
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  console.log('MessageList', props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.messages.map((messageNow) => {
        return (
          <Text
            key={messageNow.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${messageNow.from}.png`}
              />
              <Text tag="strong">
                {messageNow.from}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
              <Text
                tag='span'
                onClick={(e) => {
                  props.handleDeleteMessage(messageNow.id);
                }}
                styleSheet={{
                  display: 'flex',
                  maxWidth: '10px',
                  marginLeft: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >x
              </Text>
            </Box>
            {messageNow.text.startsWith(':sticker:') ?
              (
                <Image src={messageNow.text.replace(':sticker:', '')} width='100px' />
              )
              : (messageNow.text)
            }
          </Text>
        );
      })}
    </Box>
  )
}
