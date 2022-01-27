import appConfig from '../config.json';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Box, Button, Text, TextField, Image } from '@skynexui/components';


function Title(props) {

  const Tag = props.tag || "h1"; //recebendo o valor da tag
  return (
    <>
      {/**recebendo o valor interno da tag como parametro 
       * ${} pode ser usado para passar parametros no css 
      */}
      <Tag>{props.children}</Tag>
      <style jsx>
        {` 
          ${Tag} { 
            color: ${appConfig.theme.colors.neutrals[400]};
          }
        `}
      </style>
    </>
  )
}


// function HomePage() {
//   return (
//     <div>
//       <GlobalStyle />
//       <Title tag="h1">Boas Vindas de volta!</Title>
//       <h2>Discord - Nutri</h2>
//     </div>
//   )
// }

function HomePage() {

  const [username, setUsername] = useState();
  const [disableButton, setDisableButton] = useState(true);
  const [fullName, setFullName] = useState();
  const router = useRouter();

  useEffect(() => {
    fetch('https://api.github.com/users/' + username)
      .then(async (response) => {
        const data = await response.json()
        setFullName(data.name)
      });
  }, [username])

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (e) {
              e.preventDefault();
              //location.href = "chat"
              router.push('/chat');
            }}
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
              {appConfig.name}
            </Text>

            {/* <input value={username} onChange={function (event) {
              const value = event.target.value;
              setUsername(value)
            }} /> */}


            <TextField
              value={username}
              onChange={function (event) {
                const value = event.target.value;
                if (value.length > 2) {
                  setDisableButton(false);
                } else {
                  setDisableButton(true);
                }
                setUsername(value)
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type='submit'
              label='Entrar'
              disabled={disableButton}
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px',
            }}
          ><a href={disableButton ? '' : `https://github.com/${username}`}>
              <Image
                styleSheet={{
                  borderRadius: '50%',
                  marginBottom: '16px',
                }}
                src={disableButton ? '' : `https://github.com/${username}.png`}
              />
            </a>
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {disableButton ? '' : fullName}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}


export default HomePage