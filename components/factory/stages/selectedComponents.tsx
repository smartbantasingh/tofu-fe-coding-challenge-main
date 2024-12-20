export const SelectedComponents = ({ content }) => {
  return (
    <div className="mt-2 text-sm font-normal text-slate-700">
      <p className="mb-2">Text Components</p>
      {Object.keys(content.components).map((key) => (
        <p className="p-2 border border-gray-300" key={key}>
          {content.components[key].text}
        </p>
      ))}
    </div>
  );
};
