import { useState, useEffect } from 'react'
import siteLogo from './assets/logo.png'
import './App.css'
import Button from './components/Button'
import Section from './components/Section'
import Card from './components/Card'

const theme = {
  background: "#0b0c10",
  surface: "#1f2833",
  textPrimary: "#c5c6c7",
  textAccent: "#66fcf1",
  accent: "#66fcf1",
  accentHover: "#45a29e",
  buttonBackground: "#66fcf1",
  buttonText: "#0b0c10",
  borderColor: "#66fcf1",
};

const AppliedTheme = {
  headerLogoAndText: theme.textAccent,
  headerBackground: theme.background,
  siteBackground: theme.background,
  introBackground: theme.surface,
  cardBackgroundColor: theme.surface,
  cardBoxShadowColor: theme.accentHover,
  cardBorderColor: theme.borderColor,
};

function HomePage(){
    useEffect(() => {
    document.documentElement.style.setProperty('--site-bg-color', AppliedTheme.siteBackground);
   }, []);

  return(
    <>
     <main>
        <div className="intro" style={{
              backgroundColor: "rgba(31, 40, 51, 0.65)",  // translucent card
              backdropFilter: "blur(8px)",                // glass effect
              color: theme.textPrimary,
              padding: "2rem",
              borderRadius: "20px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",     // soft shadow
              margin: "1rem auto",
              width: "min(90%, 800px)"
            }}>
          <p className="description">
            Project N-Solar is a dynamic N-body simulation platform that allows users to model and explore the gravitational interactions between multiple celestial bodies in a customizable environment. Built with flexibility in mind, the simulator supports a variety of numerical integration methods such as Euler, RK2, RK4, RK45, Velocity Verlet, and others—making it ideal for experimenting with the trade-offs between accuracy, stability, and performance.
          </p>
          <Button name='Run Empty Sim' onClick={() => console.log('Sim started')} variant='launch' color={theme.buttonBackground} />
        </div>

        <Section name="Three Body Configurations" style={{
            backgroundColor: "rgba(31, 40, 51, 0.4)",
            backdropFilter: "blur(6px)",
            borderRadius: "20px",
            padding: "2rem",
            marginTop: "2rem",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
          }}>
          <Card title='Card 1' description='weifisi' bgColor={AppliedTheme.cardBackgroundColor} borderColor={AppliedTheme.cardBackgroundColor} boxShadowColor={AppliedTheme.cardBoxShadowColor} />
          <Card title='Card 2' description='weifisi' bgColor={AppliedTheme.cardBackgroundColor} borderColor={AppliedTheme.cardBackgroundColor} boxShadowColor={AppliedTheme.cardBoxShadowColor} />
          <Card title='Card 3' description='weifisi' bgColor={AppliedTheme.cardBackgroundColor} borderColor={AppliedTheme.cardBackgroundColor} boxShadowColor={AppliedTheme.cardBoxShadowColor} />
        </Section>
      </main>
      
      <footer></footer>
      </>
    
  );
}

function SimPage(){
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/script.js';
    script.async = true;
    document.body.appendChild(script);
    }, [])


  return(
    <>
    <div className="canvas-container">
      <canvas id="space-circles">
      </canvas>
      <canvas id="space-line-background">
      </canvas>
       <div className="toolMenu"></div>
    </div>
   
    </>
  )
}



function App() {

  const [page, setPage] = useState('home');
  const[headerStatus, setHeader] = useState(false);
  // function toggleHeader(){
  //   setHeader(!headerStatus);

  // }
    useEffect(() => {
  console.log("Header hidden?", headerStatus);
  }, [headerStatus]);



  let content;
  if (page === 'About') content = <HomePage />;
  else if (page === 'Sim') content = <SimPage />;
  else if (page === 'contact') content = <ContactPage />;
  else content = <HomePage />;

  return (
 
    <>
      <header  className={headerStatus ? 'hide-header' : ''} style={{backgroundColor: "rgba(11, 12, 16, 0.85)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(102, 252, 241, 0.2)",
          padding: "1rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 10
      }}>

        <div className="logo">
          <img src={siteLogo} alt="Site Logo" width="100" height="80"/>
          <h1 style={{ color: AppliedTheme.headerLogoAndText }}>Project N-Solar</h1>
        </div>
        
        <div className="nav-links">
          <Button name='Sim' onClick={() => setPage('Sim')} variant='header' color={AppliedTheme.headerLogoAndText} />
          <Button name='About' onClick={() => setPage('About')} variant='header' color={AppliedTheme.headerLogoAndText} />
          <Button name='Contact' onClick={() => setPage('Contact')} variant='header' color={AppliedTheme.headerLogoAndText} />
        </div>
        <div className={page=='Sim'? "hideheaderbutton" : 'hideheaderbutton2'}  onClick={() => setHeader(!headerStatus)}></div>
      </header>

      
          {/* Main Page Content */}
      <div>{content}</div>
     
    </>


  );
}

export default App;
