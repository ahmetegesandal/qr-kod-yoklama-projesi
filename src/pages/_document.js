// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html
                lang="tr"
                className="light-style layout-navbar-fixed layout-wide"
                dir="ltr"
                data-theme="theme-default"
                data-assets-path="../../assets/"
                data-template="front-pages"
                data-style="light"
            >
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap" rel="stylesheet" />
                    {/* Any additional tags */}
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
