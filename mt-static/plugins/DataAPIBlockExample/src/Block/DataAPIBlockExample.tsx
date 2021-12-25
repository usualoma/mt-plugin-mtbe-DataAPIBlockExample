import { t } from "../i18n";
import React, {
  useState,
  useEffect,
  useRef,
} from "mt-block-editor-block/React";
import { blockProperty } from "mt-block-editor-block/decorator";
import {
  BlockIframePreview,
  BlockSetupCommon,
  BlockLabel,
} from "mt-block-editor-block/Component";
import Block, {
  Metadata,
  NewFromHtmlOptions,
  EditorOptions,
} from "mt-block-editor-block/Block";

import icon from "../img/icon/DataAPIBlockExample.svg";
import css from "../css/DataAPIBlockExample.scss";

interface EditorProps {
  block: DataAPIBlockExample;
}

interface HtmlProps {
  block: DataAPIBlockExample;
}

// XXX: Change this value to your environment
const mtDataApiUrl = "/cgi-bin/mt/dataapiproxy.cgi";

async function search({ term }) {
  const selectId = "published_entries_select";

  const oldSelect = document.querySelector(`#${selectId}`);
  if (oldSelect) {
    oldSelect.remove();
  }

  const params = new URLSearchParams();
  params.set("search", term);

  const res = await fetch(`${mtDataApiUrl}/v4/search?${params.toString()}`);
  const data = await res.json();

  const select = document.createElement("select");
  select.id = selectId;

  const blank = document.createElement("option");
  blank.innerText = "選択してください";
  select.appendChild(blank);

  data.items.forEach((item) => {
    const option = document.createElement("option");
    option.innerText = item.title;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    if (!select.selectedIndex) {
      MTBlockEditorSetCompiledHtml("");
      return;
    }

    const item = data.items[select.selectedIndex - 1];
    const anchor = document.createElement("a");
    anchor.href = item.permalink;
    anchor.innerText = item.title;
    MTBlockEditorSetCompiledHtml(anchor.outerHTML);
  });

  document.body.appendChild(select);
}

const Editor: React.FC<EditorProps> = ({ block }: EditorProps) => {
  const searchRef = useRef();

  const [blockData, _setBlockData] = useState({
    title: block.title,
    permalink: block.permalink,
  });
  const setBlockData = (_blockData) => {
    block.title = _blockData.title;
    block.permalink = _blockData.permalink;
    _setBlockData(_blockData);
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    if (data.length === 0 && search !== "") {
      (async () => {
        const params = new URLSearchParams();
        params.set("search", search);

        const res = await fetch(
          `${mtDataApiUrl}/v4/sites/0/entries?${params.toString()}`
        );
        const data = await res.json();

        setData(data.items);
      })();
    }
  });

  const [search, _setSearch] = useState(block.search);
  const setSearch = (_search) => {
    block.search = _search;
    setData([]);
    _setSearch(_search);
  };

  return (
    <div className={css.DataAPIBlockExample}>
      {title !== "" ? (
        <div>
          <a
            href={block.permalink}
            onClick={(ev) => {
              ev.preventDefault();
            }}
          >
            {block.title}
          </a>
        </div>
      ) : null}
      <BlockSetupCommon block={block} />
      <BlockLabel block={block}>
        <input
          type="text"
          name="search"
          style={{ width: "15rem", marginRight: "1rem" }}
          data-mt-block-editor-focus-default
          defaultValue={search}
          ref={searchRef}
        />
        <button
          type="button"
          className="btn__mobile btn-default"
          onClick={() => {
            setSearch(searchRef.current.value);
          }}
        >
          検索
        </button>
        {data.map((item) => {
          console.log(item);
          return (
            <div
              className={`card p-3 mt-3 ${
                blockData.permalink === item.permalink
                  ? "text-white bg-primary"
                  : ""
              }`}
              onClick={() => {
                setBlockData(item);
              }}
            >
              <div>
                {item.title}
                {item.status === "Draft" ? "(未公開)" : ""}
              </div>
              <div>{item.excerpt}</div>
            </div>
          );
        })}
      </BlockLabel>
    </div>
  );
};

const Html: React.FC<HtmlProps> = ({ block }: HtmlProps) => (
  <a href={block.permalink}>{block.title}</a>
);

class DataAPIBlockExample extends Block {
  public static typeId = "taaas-dataapiblockexample";
  public static selectable = true;
  public static icon = icon;
  public static get label(): string {
    return t("DataAPIBlockExample");
  }

  public search = "";
  public title = "";
  public permalink = "";

  public constructor(init?: Partial<DataAPIBlockExample>) {
    super();
    if (init) {
      Object.assign(this, init);
    }
  }

  public metadata(): Metadata {
    return this.metadataByOwnKeys();
  }

  public editor({ focus, focusBlock }: EditorOptions): JSX.Element {
    return focus || focusBlock ? (
      <Editor key={this.id} block={this} />
    ) : (
      this.html()
    );
  }

  public html(): JSX.Element {
    return <Html key={this.id} block={this} />;
  }

  public static async newFromHtml({
    meta,
  }: NewFromHtmlOptions): Promise<DataAPIBlockExample> {
    return new DataAPIBlockExample(meta);
  }
}

export default DataAPIBlockExample;
