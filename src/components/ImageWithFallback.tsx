"use client";
import * as React from "react";
type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>,"onError"> & { src:string; alt:string; };
export default function ImageWithFallback({ src, alt, className, loading, decoding, referrerPolicy, crossOrigin, ...rest }: Props){
  const onErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.src.endsWith("/placeholder.svg")) img.src = "/placeholder.svg";
  };
  return <img {...rest} src={src} alt={alt} className={className} loading={loading} decoding={decoding as any} referrerPolicy={referrerPolicy as any} crossOrigin={crossOrigin as any} onError={onErr} />;
}