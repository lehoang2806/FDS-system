declare module 'react-awesome-lightbox' {
    import * as React from 'react';
  
    interface ImageObject {
      url: string;
      title?: string;
    }
  
    interface LightboxProps {
      image?: string;
      title?: string;
      onClose: () => void;
      images?: ImageObject[];
      startIndex?: number;
    }
  
    export default class Lightbox extends React.Component<LightboxProps> {}
  }
  