import Settings from "components/factory/stages/settings";

export const PersonalizationFactoryControlSettings = ({
  content,
  currentPaneWidth,
  fixedButtonsPaddingRight,
}) => {
  return (
    <>
      <div className="w-full h-full flex flex-col items-start">
        <div className="w-full grow flex flex-col p-6 gap-y-6 pb-40 text-neutral-700 bg-white">
          <div className="h-full">
            <Settings content={content} />
            <div
              style={{
                width: `${currentPaneWidth}%`,
                paddingRight: `${fixedButtonsPaddingRight}px`,
              }}
              className="fixed bottom-0 z-10"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
