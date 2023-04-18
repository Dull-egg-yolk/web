/* eslint-disable no-irregular-whitespace */
import { getUrlCountry } from './config';
const headInfo = {
  en: {
    LivCam: {
      title: 'GoMeet - Meet New People on Live Chat',
      html: `<meta name="description" content="GoMeet - Meet & video chat with new people online.✔️1V1 video calls ✔️1v1 chats ✔️ make new friends ✔️ find your next date.">
      <link rel="canonical" href="https://gomeet.today/"/>
      <link rel="alternate" href="https://gomeet.today/" hreflang="en" />
      <link rel="alternate" href="https://gomeet.today/tr" hreflang="tr-tr" />
      <script type="application/ld+json">
      { "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GoMeet",
      "description":"GoMeet - Meet & video chat with new people online.
      ✔️ 1V1 video calls ✔️ 1v1 chats ✔️ make new friends ✔️  find your next date.",
       "legalName" : "Clash Arts HK Limited",
      "sameAs": [ 
      "https://www.facebook.com/LivUApp/",
      "https://twitter.com/livu_videochat",
      "https://www.instagram.com/livuapp/?hl=en"],
      "url": "https://gomeet.today",
      "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="GoMeet - Meet New People on Live Chat"/>
      <meta property="og:description" content="GoMeet - Meet & video chat with new people online.✔️1V1 video calls ✔️1v1 chats ✔️make new friends ✔️ find your next date."/>
      <meta property="og:url" content="https://gomeet.today"/>
      <meta name="twitter:title" content="GoMeet - Meet New People on Live Chat"/>
      <meta name="twitter:description" content="GoMeet - Meet & video chat with new people online.✔️1V1 video calls ✔️1v1 chats ✔️make new friends ✔️ find your next date."/>`,
    },
    SafetyCenter: {
      title: 'Safety Center - GoMeet',
      html: `
        <meta name="description" content="Making GoMeet for everyone means protecting everyone who uses it. Explore what GoMeet does to help you stay safe online.">
        <link rel="canonical" href="https://gomeet.today/safety-center"/>
        <link rel="alternate" href="https://gomeet.today/safety-center" hreflang="en" />
        <link rel="alternate" href="https://gomeet.today/tr/safety-center" hreflang="tr-tr" />
        <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
        "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
        }</script>
        <meta property="og:title" content="Safety Center - GoMeet "/>
        <meta property="og:description" content="Making GoMeet for everyone means protecting everyone who uses it. Explore what GoMeet does to help you stay safe online."/>
        <meta property="og:url" content="https://gomeet.today/safety-center"/>
        <meta name="twitter:title" content="Safety Center - GoMeet "/>
        <meta name="twitter:description" content="Making GoMeet for everyone means protecting everyone who uses it. Explore what GoMeet does to help you stay safe online."/>
      `
    },
    PrivacyPolicy: {
      title: 'Privacy Center - GoMeet',
      html: `
        <meta name="description" content="We protect your digital data privacy with industry-leading security. GoMeet has built-in protection designed to strengthen our user's privacy & security.">
        <link rel="canonical" href="https://gomeet.today/privacy-center"/>
        <link rel="alternate" href="https://gomeet.today/privacy-center" hreflang="en" />
        <link rel="alternate" href="https://gomeet.today/tr/privacy-center" hreflang="tr-tr" />
        <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
        "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
        }</script>
        <meta property="og:title" content="Privacy Center - GoMeet "/>
        <meta property="og:description" content="We protect your digital data privacy with industry-leading security. GoMeet has built-in protection designed to strengthen our user's privacy & security."/>
        <meta property="og:url" content="https://gomeet.today/privacy-center"/>
        <meta name="twitter:title" content="GoMeet - Privacy Center"/>
        <meta name="twitter:description" content="We protect your digital data privacy with industry-leading security. GoMeet has built-in protection designed to strengthen our user's privacy & security."/>
      `
    },
    AboutUs: {
      title: 'About GoMeet - building the best live video chat platform',
      html: `
        <meta name="description" content="Our mission is to build the best live video chat platform and facilitate meaningful connections across cultures, languages and borders in a respectful, fun and safe way.">
        <link rel="canonical" href="https://gomeet.today/about-us"/>
        <link rel="alternate" href="https://gomeet.today/about-us" hreflang="en" />
        <link rel="alternate" href="https://gomeet.today/tr/about-us" hreflang="tr-tr" />
        <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
        "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
        }</script>
        <meta property="og:title" content="About GoMeet - building the best live video chat platform"/>
        <meta property="og:description" content="Our mission is to build the best live video chat platform and facilitate meaningful connections across cultures, languages and borders in a respectful, fun and safe way."/>
        <meta property="og:url" content="https://gomeet.today/about-us"/>
        <meta name="twitter:title" content="About GoMeet - building the best live video chat platform"/>
        <meta name="twitter:description" content="Our mission is to build the best live video chat platform and facilitate meaningful connections across cultures, languages and borders in a respectful, fun and safe way."/>
      `
    },
    RandomVideo: {
      title: 'Random Video Chat with Strangers - GoMeet',
      html: `<meta name="description" content="The new way to meet & video chat with strangers. Random video chat with people around the world and make new friends. Try it now!">
      <link rel="canonical" href="https://gomeet.today/random-video-chat"/>
      <script type="application/ld+json">
      {"@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":[{"@type":"Question","name":"What is random video chat and how does it work?",
      "acceptedAnswer":{"@type":"Answer","text":"Random video chat is a type of chat where you are paired with a random person from anywhere in the world. You can then chat with that person and get to know them. Random video chat is a great way to meet new people and make new friends.\n"}},
      {"@type":"Question","name":"What are the benefits of using random video chat?",
      "acceptedAnswer":{"@type":"Answer",
      "text":"There are many benefits of using random video chat. Random video chat can help you connect with people from all over the world. You can learn about new cultures and make new friends. Random video chat can also be a great way to practice your English skills. If you are shy, random video chat can help you overcome your shyness. Random video chat can also be a great way to meet new people and make new friends."}},{"@type":"Question","name":"How to get started with random video chat?",
      "acceptedAnswer":{"@type":"Answer","text":"It’s easy! Sign up with GoMeet now and get started in less than 60 seconds!"}},{"@type":"Question","name":"What are the best sites for random video chat?","acceptedAnswer":{"@type":"Answer","text":"GoMeete is the best site for Random Video chat. The matches we make and other features are unrivalled by any competitors."}},{"@type":"Question","name":"What are some best tips for having a successful random video chat experience?","acceptedAnswer":{"@type":"Answer","text":"Here are some tips for having a successful random video chat experience:\n\n1. Be open and honest - When you're chatting with someone, be open and honest about who you are and what you're looking for. Don't be afraid to let your personality shine through.\n\n2. Be respectful - Random video chat is a great way to meet new people, but it's important to remember that not everyone is the same. Be respectful of others and their opinions, and don't be afraid to disagree.\n\n3. Keep an open mind - Random video chat is all about meeting new people and hearing new perspectives. Keep an open mind, and you're sure to have a great time.\n\n4. Have fun! Random video chat is supposed to be fun, so make sure you're enjoying yourself. If you're not, there's no point in doing it."}}]}</script><!--FAQPage Code Generated by https://saijogeorge.com/json-ld-schema-generator/faq/-->
      <meta property="og:title" content="Random Video Chat with Strangers - GoMeet e"/>
      <meta property="og:description" content="The new way to meet & video chat with strangers. Random video chat with people around the world and make new friends. Try it now!"/>
      <meta property="og:url" content="https://gomeet.today"/>
      <meta name="twitter:title" content="Random Video Chat with Strangers - GoMeet e"/>
      <meta name="twitter:description" content="The new way to meet & video chat with strangers. Random video chat with people around the world and make new friends. Try it now!"/>`
    }
  },
  tr: {
    LivCam: {
      title: 'GoMeet - Rastgele Görüntülü Sohbet',
      html: `<meta name="description" content="Yeni insanlarla tanışmanın ve sohbet etmenin en iyi yolu. / Bire bir görüntülü aramalar ✅ rastgele görüntülü sohbetler ✅ yeni arkadaşlar edinin ✅ bir sonraki buluşmanızı ayarlayın.">
        <link rel="canonical" href="https://gomeet.today/tr/"/>
        <link rel="alternate" href="https://gomeet.today/tr" hreflang="tr-tr" />
        <link rel="alternate" href="https://gomeet.today/" hreflang="en" />
        <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
        "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
        }</script>
        <meta property="og:title" content="GoMeet - Rastgele Görüntülü Sohbet"/>
        <meta property="og:description" content="Yeni insanlarla tanışmanın ve sohbet etmenin en iyi yolu. / Bire bir görüntülü aramalar ✅ rastgele görüntülü sohbetler ✅ yeni arkadaşlar edinin ✅ bir sonraki buluşmanızı ayarlayın."/>
        <meta property="og:url" content="https://gomeet.today/tr/"/>
        <meta name="twitter:title" content="GoMeet - Rastgele Görüntülü Sohbet"/>
        <meta name="twitter:description" content="Yeni insanlarla tanışmanın ve sohbet etmenin en iyi yolu. / Bire bir görüntülü aramalar ✅ rastgele görüntülü sohbetler ✅ yeni arkadaşlar edinin ✅ bir sonraki buluşmanızı ayarlayın."/>`,
    },
    SafetyCenter: {
      title: 'Güvenlik Merkezi - GoMeet',
      html: `
        <meta name="description" content="GoMeete'yu  herkes için yapmak, onu kullanan herkesi korumak anlamına gelmektedir. GoMeet'nun çevrimiçi ortamda güvende kalmanıza yardımcı olmak için neler yaptığını keşfedin.">
        <link rel="canonical" href="https://gomeet.today/tr/safety-center"/>
        <link rel="alternate" href="https://gomeet.today/tr/safety-center" hreflang="tr-tr" />
        <link rel="alternate" href="https://gomeet.today/safety-center" hreflang="en" />
        <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
        "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
        }</script>

        <meta property="og:title" content="Güvenlik Merkezi - GoMeet e"/>
        <meta property="og:description" content="GoMeete'yu  herkes için yapmak, onu kullanan herkesi korumak anlamına gelmektedir. GoMeet'nun çevrimiçi ortamda güvende kalmanıza yardımcı olmak için neler yaptığını keşfedin."/>
        <meta property="og:url" content="https://gomeet.today/tr/safety-center"/>
        <meta name="twitter:title" content="Güvenlik Merkezi - GoMeet e"/>
        <meta name="twitter:description" content="GoMeete'yu  herkes için yapmak, onu kullanan herkesi korumak anlamına gelmektedir. GoMeet'nun çevrimiçi ortamda güvende kalmanıza yardımcı olmak için neler yaptığını keşfedin."/>
      `
    },
    PrivacyPolicy: {
      title: 'Gizlilik Merkezi - GoMeet',
      html: `
      <meta name="description" content="Dijital veri gizliliğini sektör lideri güvenlik özelliklerimizle koruyoruz.  GoMeet, kullanıcılarımızın gizliliğini ve güvenliğini güçlendirmek için tasarlanmış yerleşik bir korumaya sahiptir.">
      <link rel="canonical" href="https://gomeet.today/tr/privacy-center"/>
      <link rel="alternate" href="https://gomeet.today/tr/privacy-center" hreflang="tr-tr" />
      <link rel="alternate" href="https://gomeet.today/privacy-center" hreflang="en" />
      <script type="application/ld+json">
      { "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
      "legalName" : "Clash Arts HK Limited",
      "sameAs": [ 
      "https://www.facebook.com/LivUApp/",
      "https://twitter.com/livu_videochat",
      "https://www.instagram.com/livuapp/?hl=en"],
      "url": "https://gomeet.today",
      "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="Gizlilik Merkezi - GoMeet e"/>
      <meta property="og:description" content="Dijital veri gizliliğini sektör lideri güvenlik özelliklerimizle koruyoruz.  GoMeet, kullanıcılarımızın gizliliğini ve güvenliğini güçlendirmek için tasarlanmış yerleşik bir korumaya sahiptir."/>
      <meta property="og:url" content="https://gomeet.today/tr/privacy-center"/>
      <meta name="twitter:description" content="Dijital veri gizliliğini sektör lideri güvenlik özelliklerimizle koruyoruz.  GoMeet, kullanıcılarımızın gizliliğini ve güvenliğini güçlendirmek için tasarlanmış yerleşik bir korumaya sahiptir."/>
      `
    },
    AboutUs: {
      title: 'GoMeet hakkında - en iyi canlı görüntülü sohbet platformunu oluşturmak',
      html: `
      <meta name="description" content="Misyonumuz, en iyi canlı görüntülü sohbet platformunu oluşturmak, kültürler, diller ve sınırlar arasında saygılı, eğlenceli ve güvenli bir şekilde anlamlı bağlantıları kolaylaştırmaktır">
      <link rel="canonical" href="https://gomeet.today/tr/about-us"/>
      <link rel="alternate" href="https://gomeet.today/tr/about-us" hreflang="tr-tr" />
      <link rel="alternate" href="https://gomeet.today/about-us" hreflang="en" />
      <script type="application/ld+json">
      { "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
      "legalName" : "Clash Arts HK Limited",
      "sameAs": [ 
      "https://www.facebook.com/LivUApp/",
      "https://twitter.com/livu_videochat",
      "https://www.instagram.com/livuapp/?hl=en"],
      "url": "https://gomeet.today",
      "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="GoMeet hakkında - en iyi canlı görüntülü sohbet platformunu oluşturmak"/>
      <meta property="og:description" content="Misyonumuz, en iyi canlı görüntülü sohbet platformunu oluşturmak, kültürler, diller ve sınırlar arasında saygılı, eğlenceli ve güvenli bir şekilde anlamlı bağlantıları kolaylaştırmaktır"/>
      <meta property="og:url" content="https://gomeet.today/tr/about-us"/>
      <meta name="twitter:title" content="GoMeet hakkında - en iyi canlı görüntülü sohbet platformunu oluşturmak"/>
      <meta name="twitter:description" content="Misyonumuz, en iyi canlı görüntülü sohbet platformunu oluşturmak, kültürler, diller ve sınırlar arasında saygılı, eğlenceli ve güvenli bir şekilde anlamlı bağlantıları kolaylaştırmaktır"/>
      `
    }
  },
  gb: {
    LivCam: {
      title: 'GoMeet - Random Video Chat',
      html: `<meta name="description" content="GoMeet - Meet & video chat with new people online.✔️1V1 video calls ✔️ 1v1 chats ✔️ make new friends ✔️  find your next date.">
      <link rel="canonical" href="https://gomeet.today/"/>
      <link rel="alternate" href="https://gomeet.today/" hreflang="en-GB" />
      <link rel="alternate" href="https://gomeet.today/nl" hreflang="nl-NL" />
      <script type="application/ld+json">
      { "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️1V1 video calls ✔️random video chats ✔️ make new friends ✔️ find your next date.",
      "legalName" : "Clash Arts HK Limited",
      "sameAs": [ 
      "https://www.facebook.com/LivUApp/",
      "https://twitter.com/livu_videochat",
      "https://www.instagram.com/livuapp/?hl=en"],
      "url": "https://gomeet.today",
      "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="GoMeet - Random Video Chat"/>
      <meta property="og:description" content="GoMeet - Meet & video chat with new people online.✔️ 1V1 video calls ✔️ 1v1 chats ✔️ make new friends ✔️  find your next date."/>
      <meta property="og:url" content="https://gomeet.today"/>
      <meta name="twitter:title" content="GoMeet - Meet New People on Live Chat"/>
      <meta name="twitter:description" content="GoMeet - Meet & video chat with new people online.✔️ 1V1 video calls ✔️ 1v1 chats ✔️ make new friends ✔️  find your next date."/>`
    },
    SafetyCenter: {
      title: 'Safety Center - GoMeet',
      html: `<meta name="description" content="Making GoMeet for everyone means protecting everyone who uses it. Explore what GoMeet does to help you stay safe online.">
      <link rel="canonical" href="https://gomeet.today/safety-center"/>
      <link rel="alternate" href="https://gomeet.today/safety-center" hreflang="en" />
      <link rel="alternate" href="https://gomeet.today/nl/safety-center" hreflang="nl-NL" />
      <script type="application/ld+json">
      { "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
      "legalName" : "Clash Arts HK Limited",
      "sameAs": [ 
      "https://www.facebook.com/LivUApp/",
      "https://twitter.com/livu_videochat",
      "https://www.instagram.com/livuapp/?hl=en"],
      "url": "https://gomeet.today",
      "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="Safety Center - GoMeet e"/>
      <meta property="og:description" content="Making GoMeet for everyone means protecting everyone who uses it. Explore what GoMeet does to help you stay safe online."/>
      <meta property="og:url" content="https://gomeet.today/safety-center"/>
      <meta name="twitter:title" content="Safety Center - GoMeet e"/>
      <meta name="twitter:description" content="Making GoMeet for everyone means protecting everyone who uses it. Explore what GoMeet does to help you stay safe online."/>/>
      `
    },
    PrivacyPolicy: {
      title: 'Privacy Center - GoMeet',
      html: `<meta name="description" content="We protect your digital data privacy with industry-leading security. GoMeet has built-in protection designed to strengthen our user's privacy & security.">
      <link rel="canonical" href="https://gomeet.today/privacy-center"/>
      <link rel="alternate" href="https://gomeet.today/privacy-center" hreflang="en-GB" />
      <link rel="alternate" href="https://gomeet.today/nl/privacy-center" hreflang="nl-NL" />
      <script type="application/ld+json">
      { "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
      "legalName" : "Clash Arts HK Limited",
      "sameAs": [ 
      "https://www.facebook.com/LivUApp/",
      "https://twitter.com/livu_videochat",
      "https://www.instagram.com/livuapp/?hl=en"],
      "url": "https://gomeet.today",
      "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="Privacy Center - GoMeet "/>
      <meta property="og:description" content="We protect your digital data privacy with industry-leading security. GoMeet has built-in protection designed to strengthen our user's privacy & security."/>
      <meta property="og:url" content="https://gomeet.today/privacy-center"/>
      <meta name="twitter:title" content="GoMeet - Privacy Center"/>
      <meta name="twitter:description" content="We protect your digital data privacy with industry-leading security. GoMeet has built-in protection designed to strengthen our user's privacy & security."/>/>
      `
    },
    AboutUs: {
      title: 'About GoMeet - building the best live video chat platform',
      html: `<meta name="description" content="Our mission is to build the best live video chat platform and facilitate meaningful connections across cultures, languages and borders in a respectful, fun and safe way.">
      <link rel="canonical" href="https://gomeet.today/about-us"/>
      <link rel="alternate" href="https://gomeet.today/about-us" hreflang="en-GB" />
      <link rel="alternate" href="https://gomeet.today/nl/about-us" hreflang="nl-NL" />
      <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="About GoMeet - building the best live video chat platform"/>
      <meta property="og:description" content="Our mission is to build the best live video chat platform and facilitate meaningful connections across cultures, languages and borders in a respectful, fun and safe way."/>
      <meta property="og:url" content="https://gomeet.today/about-us"/>
      <meta name="twitter:title" content="About GoMeet - building the best live video chat platform"/>
      <meta name="twitter:description" content="Our mission is to build the best live video chat platform and facilitate meaningful connections across cultures, languages and borders in a respectful, fun and safe way."/>
    `
    }
  },
  nl: {
    LivCam: {
      title: 'Willekeurige videochat - GoMeet',
      html: `<meta name="description" content="De beste manier om vreemden te ontmoeten en met ze te chatten. ✔️ 1V1 videogesprekken ✔️ willekeurige videochats ✔️ maak neiuwe vrienden ✔️ vind je volgende date.">
      <link rel="canonical" href="https://gomeet.today/nl"/>
      <link rel="alternate" href="https://gomeet.today/nl" hreflang="nl-NL" />
      <link rel="alternate" href="https://gomeet.today/" hreflang="en-GB" />
      <script type="application/ld+json">
      { "@context": "https://schema.org",
      "@type": "Organization",
      "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
      "legalName" : "Clash Arts HK Limited",
      "sameAs": [ 
      "https://www.facebook.com/LivUApp/",
      "https://twitter.com/livu_videochat",
      "https://www.instagram.com/livuapp/?hl=en"],
      "url": "https://gomeet.today",
      "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>

      <meta property="og:title" content="Willekeurige videochat - GoMeet e"/>
      <meta property="og:description" content="De beste manier om vreemden te ontmoeten en met ze te chatten. ✔️ 1V1 videogesprekken ✔️ willekeurige videochats ✔️ maak neiuwe vrienden ✔️ vind je volgende date."/>
      <meta property="og:url" content="https://gomeet.today/nl/"/>
      <meta name="twitter:title" content="Willekeurige videochat - GoMeet e"/>
      <meta name="twitter:description" content="De beste manier om vreemden te ontmoeten en met ze te chatten. ✔️ 1V1 videogesprekken ✔️ willekeurige videochats ✔️ maak neiuwe vrienden ✔️ vind je volgende date."/>
      `
    },
    SafetyCenter: {
      title: 'Veiligheidscentrum - GoMeet',
      html: `<meta name="description" content="Om te zorgen dan GoMeet voor iedereen is, betekent dat we iedereen die het gebruikt moeten beschermen. Ontdek van GoMeet doet om je online veiligheid te beschermen">
      <link rel="canonical" href="https://gomeet.today/nl/safety-center"/>
      <link rel="alternate" href="https://gomeet.today/nl/safety-center" hreflang="nl-NL" />
      <link rel="alternate" href="https://gomeet.today/safety-center" hreflang="en-GB" />
      <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>
      <meta property="og:title" content="Veiligheidscentrum - GoMeet e"/>
      <meta property="og:description" content="Om te zorgen dan GoMeet voor iedereen is, betekent dat we iedereen die het gebruikt moeten beschermen. Ontdek van GoMeet doet om je online veiligheid te beschermen"/>
      <meta property="og:url" content="https://gomeet.today/nl/safety-center"/>
      <meta name="twitter:title" content="Veiligheidscentrum - GoMeet e"/>
      <meta name="twitter:description" content="Om te zorgen dan GoMeet voor iedereen is, betekent dat we iedereen die het gebruikt moeten beschermen. Ontdek van GoMeet doet om je online veiligheid te beschermen"/>
      `
    },
    PrivacyPolicy: {
      title: 'Privacy-centrum - GoMeet',
      html: `<meta name="description" content="We beschermen de privacy van je digitale gegevens met vooraanstaande beveiliging. GoMeet biedt ingebouwde bescherming  die is ontworken om de privacy en veiligheid van onze gebruikers te versterken.">
      <link rel="canonical" href="https://gomeet.today/nl/privacy-center"/>
      <link rel="alternate" href="https://gomeet.today/nl/privacy-center" hreflang="nl-NL" />
      <link rel="alternate" href="https://gomeet.today/privacy-center" hreflang="en-GB" />
      <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>

      <meta property="og:title" content="Privacy-centrum - GoMeet e"/>
      <meta property="og:description" content="We beschermen de privacy van je digitale gegevens met vooraanstaande beveiliging. GoMeet biedt ingebouwde bescherming  die is ontworken om de privacy en veiligheid van onze gebruikers te versterken."/>
      <meta property="og:url" content="https://gomeet.today/nl/privacy-center"/>
      <meta name="twitter:title" content="Privacy-centrum - GoMeet e"/>
      <meta name="twitter:description" content="We beschermen de privacy van je digitale gegevens met vooraanstaande beveiliging. GoMeet biedt ingebouwde bescherming  die is ontworken om de privacy en veiligheid van onze gebruikers te versterken."/>
    `
    },
    AboutUs: {
      title: 'Over GoMeet - werken aan het beste platform voor live videochat',
      html: `<meta name="description" content="Onze missie is om het beste live videochatplatform te bouwen en zinvolle verbindingen over culturen, talen en grenzen heen te vergemakkelijken op een respectvolle, leuke en veilige manier">
      <link rel="canonical" href="https://gomeet.today/nl/about-us"/>
      <link rel="alternate" href="https://gomeet.today/nl/about-us" hreflang="nl-NL" />
      <link rel="alternate" href="https://gomeet.today/about-us" hreflang="en-GB" />
      <script type="application/ld+json">
        { "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoMeet",
      "description":"The best way to meet & chat with strangers. ✔️ 1V1 video calls ✔️ random video chats ✔️ make new friends ✔️ find your next date.",
        "legalName" : "Clash Arts HK Limited",
        "sameAs": [ 
        "https://www.facebook.com/LivUApp/",
        "https://twitter.com/livu_videochat",
        "https://www.instagram.com/livuapp/?hl=en"],
        "url": "https://gomeet.today",
        "logo": "https://gomeet.today/img/logo.93d904c3.png"
      }</script>

      <meta property="og:title" content="Over GoMeet - werken aan het beste platform voor live videochat"/>
      <meta property="og:description" content="Onze missie is om het beste live videochatplatform te bouwen en zinvolle verbindingen over culturen, talen en grenzen heen te vergemakkelijken op een respectvolle, leuke en veilige manier"/>
      <meta property="og:url" content="https://gomeet.today/nl/about-us"/>
      <meta name="twitter:title" content="Over GoMeet - werken aan het beste platform voor live videochat"/>
      <meta name="twitter:description" content="Onze missie is om het beste live videochatplatform te bouwen en zinvolle verbindingen over culturen, talen en grenzen heen te vergemakkelijken op een respectvolle, leuke en veilige manier"/>
    `
    }
  },
};

const lang = getUrlCountry();

export default (pageName) => {
  if (document.querySelectorAll('meta')[3].name === 'description') return;

  const langData = headInfo[lang] || headInfo.en;
  const headData = langData[pageName] || headInfo.en[pageName] || '';
  if (!headData) return;
  document.title = headData.title;
  const div = document.createElement('div');

  div.innerHTML = headData.html;
  const b = div.childNodes;

  b.forEach(item => {
    if (item.nodeType === 1) {
      document.head.insertBefore(item, document.querySelectorAll('link')[0]);
    }
  });
};
