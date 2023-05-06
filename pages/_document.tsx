import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import 'regenerator-runtime/runtime';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* <!-- Messenger Chat plugin Code --> */}
        <div id="fb-root"></div>

        {/* <!-- Your Chat plugin code --> */}
        <div id="fb-customer-chat" className="fb-customerchat"></div>
        <Script
          id="messenger-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `var chatbox = document.getElementById('fb-customer-chat');
            chatbox.setAttribute("page_id", "109132085496381");
            chatbox.setAttribute("attribution", "biz_inbox");`,
          }}
        ></Script>

        <Script
          id="messenger-sdk"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: ` window.fbAsyncInit = function() {
              FB.init({
                xfbml            : true,
                version          : 'v16.0'
              });
            };
      
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));`,
          }}
        ></Script>

        <Main />
        <NextScript />
        <div id="recaptcha-container" style={{ display: 'none' }}></div>
      </body>
    </Html>
  );
}
