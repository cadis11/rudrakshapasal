type Props = { src:string; title?:string };
export default function XrayPdf({ src, title="Authenticity Report (X-Ray)" }:Props){
  return (
    <div className="card p-4 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <div className="w-full h-[480px]">
        <object data={`${src}#toolbar=1&navpanes=0`} type="application/pdf" className="w-full h-full rounded-lg">
          <p className="text-sm text-white/70">PDF viewer not available. <a className="underline" href={src} target="_blank">Open the report</a>.</p>
        </object>
      </div>
    </div>
  );
}