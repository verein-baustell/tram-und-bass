<script>
  // Set the date we're counting down to

  const today = new Date();
  const releaseDate = new Date("2024-11-16T02:00:00");
  const showLandingPage = today <= releaseDate;

  var countDownDate = new Date("Nov 17, 2024 05:30:00").getTime();
  var countDownDateParty = new Date("Nov 15, 2024 18:00:00").getTime();

  var days = 0;
  var hours = 0;
  var minutes = 0;
  var seconds = 0;

  var daysParty = 0;
  var hoursParty = 0;
  var minutesParty = 0;
  var secondsParty = 0;
  
  // Update the count down every 1 second
  var x = setInterval(function() {
  
    // Get today's date and time
    var now = new Date().getTime();
  
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
  
    // Time calculations for days, hours, minutes and seconds
    days = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  }, 1000);

  var y = setInterval(function() {
  
  // Get today's date and time
  var nowParty = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDateParty - nowParty;

  // Time calculations for days, hours, minutes and seconds
  daysParty = Math.floor(distance / (1000 * 60 * 60 * 24));
  hoursParty = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutesParty = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  secondsParty = Math.floor((distance % (1000 * 60)) / 1000);

}, 1000);
  </script>


<svelte:head>
  <title>Tram und Bass</title>
  <meta name="description" content="Tram und Bass - ab 15. November 2024. 30 Artists 30 Tramlinien. Ein Projekt von Verein Baustell und RTFM. ">
  <meta name="keywords" content="Tram und Bass, Tram, Bass, Zürich, VBZ, 15. November 2024, elektronische Musik">
</svelte:head>

{#if showLandingPage}
<div class="splash-a">
  <div class="container">
    <img class="logo" src="/images/TnB_logo.svg" alt="Tram und Bass">
    <div class="text title countdown">
      <p id="numbers"> { daysParty + "d " + hoursParty + "h "
    + minutesParty + "m " + secondsParty + "s " }</p>
    </div>
    <div class="text title release">
      <p>Release im Dynamo: 15.11.2024</p>
    </div>
  <div class="links view">
    <p class="center title">Links</p>
    <div class="abc">
      <button class="center" type="button" onClick="location.href='https://www.instagram.com/tramundbass/'" formtarget="_blank">
        Instagram
      </button>
    </div>
    <div class="abc">
      <button class="center" type="button" onClick="location.href='https://eventfrog.ch/en/p/party/house-techno/tram-und-bass-release-7253437853551507373.html'" formtarget="_blank">
        Tickets - Release 15.11.2024 im Dynamo
      </button>
    </div>
  </div>
  <div class="newsletter view">
    <p class="center title">Newsletter</p>
    <form method="post" action="https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/18147/submit" class="inf-form tnb-form">
      <input type="email" name="email" style="display:none" />
      <input type="hidden" name="key" value="eyJpdiI6ImdINFozcW42NytaYkJ4eTlLT0p5VGNmWjJramVcL3djVmExajRwUWUwc0pFPSIsIm1hYyI6IjdmMDVkZWVlMzRhNjJlY2YzYzJlZDY5MDQ2ZGRkYTczOTM3MWY2MWU4MjU5ZTcxZjY1ZjcxYjIwMjk2ZWM4ZTUiLCJ2YWx1ZSI6IlEyTmQ3QVJvN0RGOVBNWEc5bUl4ZHFJa0hkVGd3SzF1NFdwYmcrUWlid0k9In0=">
      <input type="hidden" name="webform_id" value="18147">
      <style> .inf-main_41371be284c70c592049717c38e42081{ background-color:#FFFFFF; padding:16px 16px; margin:0px auto; } .inf-main_41371be284c70c592049717c38e42081 .inf-content { margin-top:0px;} .inf-main_41371be284c70c592049717c38e42081 h4, .inf-main_41371be284c70c592049717c38e42081 span, .inf-main_41371be284c70c592049717c38e42081 label, .inf-main_41371be284c70c592049717c38e42081 input, .inf-main_41371be284c70c592049717c38e42081 .inf-submit, .inf-main_41371be284c70c592049717c38e42081 .inf-success p a { color:#000000; font-size:1em; } .inf-main_41371be284c70c592049717c38e42081 h4{ font-size:1em; margin:0px 0px 12px 0px; } .inf-main_41371be284c70c592049717c38e42081 h4, .inf-main_41371be284c70c592049717c38e42081 label{ font-weight:bold; } .inf-main_41371be284c70c592049717c38e42081 .inf-input { margin-bottom:6px;} .inf-main_41371be284c70c592049717c38e42081 label { display:block;} .inf-main_41371be284c70c592049717c38e42081 input{ height:2em; color:#EEEEEE; border: 1px solid #EEEEEE; border:none; padding-left:16px; } .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error label, .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error span.inf-message{ color: #cc0033; } .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error input{ border: 1px solid #EEEEEE; } .inf-main_41371be284c70c592049717c38e42081 .inf-input input { width:100%;} .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error span.inf-message { display: block; } .inf-main_41371be284c70c592049717c38e42081 .inf-submit { text-align:center; min-width:100%;} .inf-main_41371be284c70c592049717c38e42081 .inf-submit input{ background-color:#000000; color:#FFFFFF!important; cursor:pointer; border:none; border-radius:0.48em; font-weight: normal; height:auto; padding:8px; } .inf-main_41371be284c70c592049717c38e42081 .inf-submit input.disabled{ opacity: 0.4; } .inf-btn { color: rgb(85, 85, 85); border: medium none; font-weight: normal; height: auto; padding: 7px; display: inline-block; background-color: white; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.24); border-radius: 2px; line-height: 1em; } .inf-rgpd { margin:0px 0px 0px 0px; color:#555555; } </style>

      <div class="inf-main_41371be284c70c592049717c38e42081"> 
        <h4></h4> 
        <span></span> 
        <div class="inf-success" style="display:none"> 
          <h4>Deine Anmeldung war erfolgreich!</h4>   
          <p> <a href="#" class="inf-btn">&laquo;</a> </p> 
        </div> 
        <div class="inf-content"> 
          <div class="inf-input inf-input-text"> 
            <input type="email" name="inf[1]" data-inf-meta="1" data-inf-error="" required="required" placeholder="Email *" > 
          </div> 
          <div class="inf-input inf-input-text"> 
            <input type="text" name="inf[62029]" data-inf-meta="62029" data-inf-error="" placeholder="Nickname " > 
          </div> 
          <div class="inf-rgpd"></div> 
          <div style=""> 
            <label data-mcaptcha_url="https://captcha.infomaniak.com/widget/?sitekey=wKJaAigS1e48fWgqtjvg5w7rKA6QIwmy" for="mcaptcha__token" id="mcaptcha__token-label"> 
              <input type="text" name="mcaptcha__token" id="mcaptcha__token"/> 
            </label> 
            <div id="mcaptcha__widget-container"></div> 
            <script src="https://unpkg.com/@mcaptcha/vanilla-glue@0.1.0-rc2/dist/index.js"></script> 
          </div> 
          <div class="inf-submit"> 
            <input type="submit" style="margin-top: 25px;" name="" value="Anmelden"> 
          </div> 
        </div> 
      </div> 
    </form>
</div>
  <div class="support view">
    <p class="center title">Ganz viel Liebe</p>
    <div class="s-grid">
      <img class="supporter" src="/images/baustell.svg" alt="Verein Baustell Logo" />
      <img class="supporter" src="/images/rtfm.svg" alt="Verein RTFM Logo" />
    </div>
  </div>

  <div class="support view">
    <p class="center title">Unterstützt von</p>
    <div class="s-grid">
      <img class="supporter" src="/images/Stadt.png" alt="Stadt Supporter Logo" />
      <img class="supporter" src="/images/Migros.png" alt="Migros Supporter Logo" />
      <img class="supporter" src="/images/ErnstGohner.png" alt="Ernst Göhner Supporter Logo" />
      <img class="supporter" src="/images/VBZ.png" alt="VBZ Supporter Logo" />
      <img class="supporter" src="/images/Temperatio.png" alt="Temperatio Supporter Logo" />
      <img class="supporter" src="/images/Kanton.png" alt="Kanton Supporter Logo" />
    </div>
  </div>

  <div class="support view">
    <p class="center title">Kontakt</p>
    <p class="center text-center"><b>Verein Tram und Bass </b>
    <br>
    Hardgutstrasse 7
    <br>
    8048 Zürich
    <br>
    info@tramundbass.ch
    </p>
  </div>
</div>
<img id="gif" src="/images/IntroShortSimple.gif" alt="Hintergrundanimation einer Tramfahrt" loading="lazy" />
</div>
{:else}
<div class="splash-b">
  <div class="container">
    <img class="logo" src="/images/TnB_logo.svg" alt="Tram und Bass">
    <div class="text title countdown">
      <p>Das erste Tram fährt in</p>
    </div>
    <div class="text title release">
      <p id="numbers"> { days + "d " + hours + "h " + minutes + "m " + seconds + "s " }</p>
    </div>

    <div class="schedule view">
      <p class="center title">Nächste Fahrten</p>
      <div class="history">
        <div class="header">
          <div class="content">
            <div class="schedule-item">
              <p>2</p>

              <!-- Show 'name' by default and 'artistName' on hover -->
              <p class="name default">Bahnhof Tiefenbrunnen</p>
              <p class="name hover">Viola</p>

              <p class="time">17.11.2024</p>
            </div>
            <div class="schedule-item">
              <p>8</p>

              <!-- Show 'name' by default and 'artistName' on hover -->
              <p class="name default">Hardturm</p>
              <p class="name hover">EXGÜSI</p>

              <p class="time">18.11.2024</p>
            </div>
            <div class="schedule-item">
              <p>11</p>

              <!-- Show 'name' by default and 'artistName' on hover -->
              <p class="name default">Rehalp</p>
              <p class="name hover">Dschinn</p>

              <p class="time">19.11.2024</p>
            </div>
            <div class="schedule-item">
              <p>12</p>

              <!-- Show 'name' by default and 'artistName' on hover -->
              <p class="name default">Bahnhof Stettbach</p>
              <p class="name hover">Endobliss</p>

              <p class="time">20.11.2024</p>
            </div>
            <div class="schedule-item">
              <p>17</p>

              <!-- Show 'name' by default and 'artistName' on hover -->
              <p class="name default">Albisgütli</p>
              <p class="name hover">Jenny Cara</p>

              <p class="time">21.11.2024</p>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="links view">
      <p class="center title">Instagram</p>
      <a href="https://www.instagram.com/tramundbass">
            <div class="insta">
                <img class="pic" src="/images/insta1.webp" alt="Instagram" />
                <img class="pic" src="/images/insta2.webp" alt="Instagram" />
                <img class="pic" src="/images/insta3.webp" alt="Instagram" />
                <img class="pic" src="/images/insta4.webp" alt="Instagram" /> 
                <img class="pic" src="/images/insta5.webp" alt="Instagram" />
        </div>
      </a>
    </div>

    <div class="newsletter view">
      <p class="center title">Newsletter</p>
        <form method="post" action="https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/18147/submit" class="inf-form tnb-form">
        <input type="email" name="email" style="display:none" />
        <input type="hidden" name="key" value="eyJpdiI6ImdINFozcW42NytaYkJ4eTlLT0p5VGNmWjJramVcL3djVmExajRwUWUwc0pFPSIsIm1hYyI6IjdmMDVkZWVlMzRhNjJlY2YzYzJlZDY5MDQ2ZGRkYTczOTM3MWY2MWU4MjU5ZTcxZjY1ZjcxYjIwMjk2ZWM4ZTUiLCJ2YWx1ZSI6IlEyTmQ3QVJvN0RGOVBNWEc5bUl4ZHFJa0hkVGd3SzF1NFdwYmcrUWlid0k9In0=">
        <input type="hidden" name="webform_id" value="18147">
        <style> .inf-main_41371be284c70c592049717c38e42081{ background-color:#FFFFFF; padding:16px 16px; margin:0px auto; } .inf-main_41371be284c70c592049717c38e42081 .inf-content { margin-top:0px;} .inf-main_41371be284c70c592049717c38e42081 h4, .inf-main_41371be284c70c592049717c38e42081 span, .inf-main_41371be284c70c592049717c38e42081 label, .inf-main_41371be284c70c592049717c38e42081 input, .inf-main_41371be284c70c592049717c38e42081 .inf-submit, .inf-main_41371be284c70c592049717c38e42081 .inf-success p a { color:#000000; font-size:1em; } .inf-main_41371be284c70c592049717c38e42081 h4{ font-size:1em; margin:0px 0px 12px 0px; } .inf-main_41371be284c70c592049717c38e42081 h4, .inf-main_41371be284c70c592049717c38e42081 label{ font-weight:bold; } .inf-main_41371be284c70c592049717c38e42081 .inf-input { margin-bottom:6px;} .inf-main_41371be284c70c592049717c38e42081 label { display:block;} .inf-main_41371be284c70c592049717c38e42081 input{ height:2em; color:#EEEEEE; border: 1px solid #EEEEEE; border:none; padding-left:16px; } .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error label, .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error span.inf-message{ color: #cc0033; } .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error input{ border: 1px solid #EEEEEE; } .inf-main_41371be284c70c592049717c38e42081 .inf-input input { width:100%;} .inf-main_41371be284c70c592049717c38e42081 .inf-input.inf-error span.inf-message { display: block; } .inf-main_41371be284c70c592049717c38e42081 .inf-submit { text-align:center; min-width:100%;} .inf-main_41371be284c70c592049717c38e42081 .inf-submit input{ background-color:#000000; color:#FFFFFF!important; cursor:pointer; border:none; border-radius:0.48em; font-weight: normal; height:auto; padding:8px; } .inf-main_41371be284c70c592049717c38e42081 .inf-submit input.disabled{ opacity: 0.4; } .inf-btn { color: rgb(85, 85, 85); border: medium none; font-weight: normal; height: auto; padding: 7px; display: inline-block; background-color: white; box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.24); border-radius: 2px; line-height: 1em; } .inf-rgpd { margin:0px 0px 0px 0px; color:#555555; } </style>
        <div class="inf-main_41371be284c70c592049717c38e42081"> 
        <h4></h4> 
        <span></span> 
        <div class="inf-success" style="display:none"> 
          <h4>Deine Anmeldung war erfolgreich!</h4>   
          <p> <a href="#" class="inf-btn">&laquo;</a> </p> 
        </div> 
        <div class="inf-content"> 
          <div class="inf-input inf-input-text"> 
            <input type="email" name="inf[1]" data-inf-meta="1" data-inf-error="" required="required" placeholder="Email *" > 
          </div> 
          <div class="inf-input inf-input-text"> 
            <input type="text" name="inf[62029]" data-inf-meta="62029" data-inf-error="" placeholder="Nickname " > 
          </div> 
          <div class="inf-rgpd"></div> 
          <div style=""> 
            <label data-mcaptcha_url="https://captcha.infomaniak.com/widget/?sitekey=wKJaAigS1e48fWgqtjvg5w7rKA6QIwmy" for="mcaptcha__token" id="mcaptcha__token-label"> 
              <input type="text" name="mcaptcha__token" id="mcaptcha__token"/> 
            </label> 
            <div id="mcaptcha__widget-container"></div> 
            <script src="https://unpkg.com/@mcaptcha/vanilla-glue@0.1.0-rc2/dist/index.js"></script> 
          </div> 
          <div class="inf-submit"> 
            <input type="submit" style="margin-top: 25px;" name="" value="Anmelden"> 
          </div> 
        </div> 
      </div> 
    </form>

</div>
  <div class="support view">
    <p class="center title">Ganz viel Liebe</p>
    <div class="s-grid">
      <img class="supporter" src="/images/baustell.svg" alt="Verein Baustell Logo" />
      <img class="supporter" src="/images/rtfm.svg" alt="Verein RTFM Logo" />
    </div>
  </div>

  <div class="support view">
    <p class="center title">Unterstützt von</p>
    <div class="s-grid">
      <img class="supporter" src="/images/Stadt.png" alt="Stadt Supporter Logo" />
      <img class="supporter" src="/images/Migros.png" alt="Migros Supporter Logo" />
      <img class="supporter" src="/images/ErnstGohner.png" alt="Ernst Göhner Supporter Logo" />
      <img class="supporter" src="/images/VBZ.png" alt="VBZ Supporter Logo" />
      <img class="supporter" src="/images/Temperatio.png" alt="Temperatio Supporter Logo" />
      <img class="supporter" src="/images/Kanton.png" alt="Kanton Supporter Logo" />
    </div>
  </div>

  <div class="support view">
    <p class="center title">Kontakt</p>
    <p class="center text-center"><b>Verein Tram und Bass </b>
    <br>
    Hardgutstrasse 7
    <br>
    8048 Zürich
    <br>
    info@tramundbass.ch
    </p>
  </div>
  </div>
  <img id="gif" src="/images/IntroShortSimple.gif" alt="Hintergrundanimation einer Tramfahrt" loading="lazy" />
</div>
{/if}

<style lang="scss">
  .insta{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        column-gap: 0.3em;
    }
    .pic{
        border-radius: 0.3em;
        transition: 0.2s;
    }

    .pic:hover{
        scale: 0.95;
        transition: 0.2s;
        filter: brightness(1.1);
    }

    .c-insta:hover{
        background-color: #E2E2E2;
    }

  .history {
    /* background: black; */
    /* border-radius: var(--border-radius-view); */
    padding: 0.1em;
    /* margin-bottom: 5px; */
    overflow: hidden;
    color: black;
  }

  .content {
    background: black;
    border-radius: var(--border-radius-view);
    padding-left: 0.8em;
    padding-top: 0.8em;
    padding-bottom: 0.8em;
    padding-right: 1.2em;
  }
  .schedule-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0.1em;
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: "HoloMono";
    font-size: 15px;
    color: white;

    p {
      margin: 0;
      padding: 0;
    }

    // Number container
    & > p:first-child {
      flex: 0 0 20px;
      text-align: right;
    }

    // Name container, showing different text on hover
    & .name.default {
      padding-left: 1em;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & .name.hover {
      padding-left: 1em;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: none;
    }

    // Show artist name on hover
    &:hover .name.default {
      display: none;
    }
    &:hover .name.hover {
      display: block;
    }

    // Time and arrow container
    span {
      display: flex;
      align-items: center;
      flex: 0 0 5%;
      justify-content: flex-end;

      // Initially hide the arrow
      img {
        height: 1em;
        margin-left: 0.5em; // space between time and arrow
        opacity: 0;
        transition: opacity 0.2s ease;
        filter: invert(1);
      }
    }

    // Show the arrow on hover
    &:hover span img {
      opacity: 1;
    }
    .time {
      margin: 0;
      padding: 0;
      flex: 0 0 35px;
      text-align: right;
    }
  }

  /* Media query for mobile */
  @media (max-width: 600px) {
    button {
      padding: 0.15em 0.4em;
    }
  }

  .break{
    margin-top: 2em;
  }
  button {
    background-color: black;
    padding: 0.5em 0.8em;
    color: white;
    border: none;
    border-radius: var(--border-radius-button);
    cursor: pointer;
    transition: var(--transition);
  }

  button:hover{
    background-color: #353535;
  }

  .release{
    color: black;
    margin-top: 0.2em;
    background-color: white;
    border-radius: 2em;
    padding-top: 0.2em;
    padding-left: 0.6em;
    padding-right: 0.6em;
  }

  .abc{
    width: 100%;
    margin-top: 0.2em;
    display: flex;
  }

  .support{
    width: 100%;
    padding-top: 1em;
    margin-bottom: 0.8em;
    padding-left: 1em;
    padding-right: 1em;
  }

  .text-center{
    text-align: center;
    margin-bottom: 1em;
  }

  .countdown{
    background-color: black;
    color: white;
    border-radius: 2em;
    padding-top: 0.2em;
    padding-left: 0.6em;
    padding-right: 0.6em;
    margin-bottom: 0px;
    margin-top: 1em !important;
  }

  .title{
    font-family: Rene;
    font-size: 1.2em;
    margin-bottom: 0.6em;
  }

  .center{
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
  }

  .text{
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
  .s-grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .supporter{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2em;
    margin-bottom: 2em;
  }

  input{
    background-color: #EEEEEE;
    color: black !important;
    border-radius: var(--border-radius-button);
    height: 40px !important;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .splash {
    z-index: 5000;
    display: inline;
    height: 100vh;
    width: 100vw;
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .links{
    width: 100%;
    margin-bottom: 0.8em;
    margin-left: auto;
    margin-right: auto;
    padding-top: 1em;
    padding-left: 1em;
    padding-bottom: 1em;
    padding-right: 1em;
  }

  .schedule{
    width: 100%;
    margin-top: 2em;
    margin-bottom: 0.8em;
    margin-left: auto;
    margin-right: auto;
    padding-top: 1em;
    padding-left: 1em;
    padding-bottom: 1em;
    padding-right: 1em;
  }

  #gif{
    position: fixed;
    top: 0;
    z-index: -1000;
    min-height: 100vh;
    min-width: 100vw;
    scale: 1.1;
    width: auto;
    height: auto;
    filter: saturate(2) blur(16px) brightness(75%);
  }

  .newsletter {
    padding-top: 1em;
    width: 100%;
    margin-bottom: 0.8em;
  }

  .container{
    width: 40vw;
    margin-left: auto;
    margin-right: auto;
    height: 100vh;
    overflow: scroll;
    padding: var(--global-padding);
  }
  
  .container::-webkit-scrollbar {
  display: none;
  }

  .container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
  .logo{
    padding-top: 4em;
    margin-left: auto;
    width: 100%;
    height: auto;
    margin-right: auto;
  }

  @media only screen and (max-width: 600px) {
  	.container {
    	width: 100%;
  }
}
</style>
