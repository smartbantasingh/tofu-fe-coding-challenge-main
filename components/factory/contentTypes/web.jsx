import Spinner from "@/components/core/spinner";
import { useUpdateContentGroup } from "@/hooks/api/contentGroup";
import { useEffect, useRef, useState } from "react";

const WEBSITE_IFRAME_HTML_ID = "website-iframe";
const CONTENT_GROUP_ID = 231864;

const Web = () => {
  const iframeRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState(null);
  const [fetchingHtml, setFetchingHtml] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);
  const { updateContentGroup } = useUpdateContentGroup();

  const fetchAndSetHtml = async (url) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      setHtmlContent(html);
    } catch (error) {
      console.error("Error fetching HTML:", error);
    } finally {
      setFetchingHtml(false);
    }
  };

  const initDisplayContent = async () => {
    setFetchingHtml(true);
    await fetchAndSetHtml("/landing-page.html");
  };

  useEffect(() => {
    initDisplayContent();
  }, []);

  const addHoverHandler = (element) => {
    // hover effect
    element.addEventListener("mouseover", () => {
      element.classList.add("tofu-hovered-element");
    });
    element.addEventListener("mouseout", () => {
      element.classList.remove("tofu-hovered-element");
    });
  };

  const modifySelectedElements = (selectedElement) => {
    setSelectedElements((prev) => {
      const currentSelectedElements = [...prev];
      const index = currentSelectedElements.findIndex(
        (element) => element.dataset.tofuId === selectedElement.dataset.tofuId
      );
      if (index > -1) {
        // remove if existing
        currentSelectedElements.splice(index, 1);
      } else {
        // add if not existing
        currentSelectedElements.push(selectedElement);
      }
      return currentSelectedElements;
    });
  };

  const createComponentsPayload = () => {
    const components = {};
    selectedElements.forEach((element, index) => {
      const precedingElement = index === 0 ? null : selectedElements[index - 1];
      const succeedingElement =
        index === selectedElements.length - 1
          ? null
          : selectedElements[index + 1];
      components[element.dataset.tofuId] = {
        meta: {
          type: "text",
          html_tag: `<${element.tagName.toLowerCase()}>`,
          time_added: Date.now(),
          html_tag_index: null,
          selected_element: element.outerHTML,
          preceding_elememt: precedingElement ? precedingElement.outerHTML : "",
          succeeding_element: succeedingElement
            ? succeedingElement.outerHTML
            : "",
        },
        text: element.innerText,
      };
    });
    return components;
  };

  useEffect(() => {
    const payload = {
      components: createComponentsPayload(),
    };
    updateContentGroup({ id: CONTENT_GROUP_ID, payload });
  }, [selectedElements]);

  const addSelectHandler = (element) => {
    element.addEventListener("click", () => {
      element.classList.toggle("tofu-selected-element");
      modifySelectedElements(element);
    });
  };

  const addEventHandlers = (elements) => {
    elements.forEach((element, index) => {
      //hover effect
      addHoverHandler(element);
      //select effect
      addSelectHandler(element);
    });
  };

  const getTofuElements = () => {
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument;
    const elements = iframeDocument.querySelectorAll(".tofu-element");
    return elements;
  };

  const setupTofuElements = () => {
    const elements = getTofuElements();
    addEventHandlers(elements);
  };

  useEffect(() => {
    if (htmlContent) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        setupTofuElements();
      };
    }
  }, [htmlContent]);

  return (
    <>
      <div className="relative w-full h-full">
        {fetchingHtml && (
          <div className="absolute left-0 w-full h-full bg-white">
            <Spinner className="flex justify-center items-center h-40" />
          </div>
        )}
        <iframe
          id={WEBSITE_IFRAME_HTML_ID}
          srcDoc={htmlContent}
          className="w-full h-full"
          ref={iframeRef}
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </>
  );
};

export default Web;
