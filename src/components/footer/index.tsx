import './footer.css';

import * as React from 'react';
import { faBook, faDownload, faEnvelope, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalProps } from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import { useHistory } from 'react-router-dom';

import AboutModal from './AboutModal';
import ContactModal from './ContactModal';
import DocumentationModal from './DocumentationModal';
import DownloadModal from './DownloadModal';
import { TextContext } from '../../context';
import { getUrlParam } from '../../util/url';
import { useLocalization } from '../../util/localization';

// eslint-disable-next-line
const version: string = (window as any).VERSION;

const enum Tab {
  About = 'about',
  Download = 'download',
  Documentation = 'documentation',
  Contact = 'contact',
}

const Tabs: Record<Tab, (props: ModalProps) => React.ReactElement> = {
  [Tab.About]: AboutModal,
  [Tab.Download]: DownloadModal,
  [Tab.Documentation]: DocumentationModal,
  [Tab.Contact]: ContactModal,
};

const FooterNav_ = ({
  setOpenTab,
}: {
  setOpenTab: React.Dispatch<React.SetStateAction<Tab | undefined>>;
}): React.ReactElement => {
  const { t } = useLocalization();

  return (
    <Nav as="ul" className="p-0" role="navigation" style={{ cursor: 'pointer' }} variant="pills">
      <Nav.Item as="li">
        <Nav.Link className="footer-link" onClick={() => setOpenTab(Tab.About)}>
          <FontAwesomeIcon icon={faQuestionCircle} /> {t('About')}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link className="footer-link" onClick={() => setOpenTab(Tab.Download)}>
          <FontAwesomeIcon icon={faDownload} /> {t('Download')}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link className="footer-link" onClick={() => setOpenTab(Tab.Documentation)}>
          <FontAwesomeIcon icon={faBook} /> {t('Documentation')}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link className="footer-link" onClick={() => setOpenTab(Tab.Contact)}>
          <FontAwesomeIcon icon={faEnvelope} /> {t('Contact')}
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
const FooterNav = React.memo(FooterNav_);
const textUrlParam = 'dir';
const Footer = ({
  wrapRef,
  pushRef,
}: {
  wrapRef: React.RefObject<HTMLElement>;
  pushRef: React.RefObject<HTMLElement>;
}): React.ReactElement => {
  const { t } = useLocalization();
  const history = useHistory();
  const languagePair = getUrlParam(history.location.search, textUrlParam);
  const { srcText, tgtText } = React.useContext(TextContext);

  const [openTab, setOpenTab] = React.useState<Tab | undefined>(undefined);

  const footerRef = React.createRef<HTMLDivElement>();
  React.useLayoutEffect(() => {
    const refreshSizes = () => {
      if (pushRef.current && wrapRef.current && footerRef.current) {
        const footerHeight = footerRef.current.offsetHeight;
        pushRef.current.style.height = `${footerHeight}px`;
        wrapRef.current.style.marginBottom = `-${footerHeight}px`;
      }
    };

    window.addEventListener('resize', refreshSizes);
    refreshSizes();

    return () => window.removeEventListener('resize', refreshSizes);
  }, [footerRef, wrapRef, pushRef]);

  return (
    <>
      <div className="d-flex flex-column container" ref={footerRef}>
        <div className="d-flex flex-column container">
          <div className="d-none d-md-flex flex-wrap flex-row justify-content-between position-relative row">
            <FooterNav setOpenTab={setOpenTab} />

            <div className="mb-4 d-flex flex-column">
              <div className="card d-inline-block bg-light p-2">
                <span>{t('Notice_Mistake')}</span>{' '}
                <a
                  className="p-0"
                  href={`https://github.com/apertium/apertium-${
                    languagePair ?? 'default'
                  }/issues/new?title=Suggested+translation+improvement&body=SOURCE: ${srcText}%0A%0AGOT: ${tgtText}%0A%0AEXPECTED: %20%5BYOUR%20TRANSLATION%20SUGGESTION%20GOES%20HERE%5D`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('Help_Improve')}{' '}
                </a>
              </div>

              <small className="text-muted d-none d-lg-block version align-self-end">{version}</small>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(Tabs).map(([tab, Modal]) => (
        <Modal key={tab} onHide={() => setOpenTab(undefined)} show={openTab === tab} />
      ))}
    </>
  );
};

export default Footer;
