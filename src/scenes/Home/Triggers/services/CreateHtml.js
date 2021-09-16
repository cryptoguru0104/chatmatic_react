export const getButtonHtml = options => {
  const { color, size, redirectUrl, fbId, publicId } = options;

  let htmlCode = `<script>window.fbAsyncInit=function(){FB.init({appId:'${process.env.REACT_APP_FACEBOOK_APP_ID}',autoLogAppEvents:true,xfbml:true,version:'v9.0'});`;
  if (redirectUrl) {
    htmlCode += `FB.Event.subscribe('send_to_messenger',function(e){if(e.event=='opt_in'){window.location.replace("${redirectUrl}")}})`;
  }
  htmlCode += `};</script><script async defer src="https://connect.facebook.net/en_US/sdk.js"></script> <div class="fb-send-to-messenger" messenger_app_id="${process.env.REACT_APP_FACEBOOK_APP_ID}" page_id="${fbId}" data-ref="campaign::${publicId}" color="${color}" size="${size}"> </div>`;

  // const htl = `<script>window.fbAsyncInit=function(){FB.init({appId:'${process.env.REACT_APP_FACEBOOK_APP_ID}',autoLogAppEvents:true,xfbml:true,version:'v6.0'});};</script><script async defer src="https://connect.facebook.net/en_US/sdk.js"></script> <div class="fb-send-to-messenger" messenger_app_id="${process.env.REACT_APP_FACEBOOK_APP_ID}" page_id="${fbId}" data-ref="campaign::${publicId}" color="${color}" size="${size}"> </div>`;

  return htmlCode;
};

export const getChatWidgetHtml = options => {
  const { color, logInGreeting, logOutGreeting, greetingDialogDisplay, delay, fbId, publicId } = options;
  let htmlCode = `<script>window.fbAsyncInit=function(){FB.init({appId:'${process.env.REACT_APP_FACEBOOK_APP_ID}',autoLogAppEvents:true,xfbml:true,version:'v9.0'});};</script><script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>`;
  htmlCode += `<script>(function(d,s,id){var js,fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s); js.id = id;js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));</script>`;
  htmlCode += `<div class="fb-customerchat" page_id="${fbId}" theme_color="${color}" logged_in_greeting="${logInGreeting}" logged_out_greeting="${logOutGreeting}" greeting_dialog_display="${greetingDialogDisplay}" greeting_dialog_delay="${delay}" ref="campaign::${publicId}"> </div>`;
  
  return htmlCode; 
}
