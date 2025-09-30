import { useState } from "react";

export const useTemplateSectionHooks = ()=>{
      const [tab, setTab] = useState(0);

      return{
        tab,
        setTab
      }
}