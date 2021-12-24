import { t } from "../i18n";
import React, { useState, useEffect } from "mt-block-editor-block/React";
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

const Editor: React.FC<EditorProps> = blockProperty(
  ({ block }: EditorProps) => (
    <div className={css.DataAPIBlockExample}>
      <BlockSetupCommon block={block} />
      <BlockLabel block={block}>
        <input type="text" name="text" data-mt-block-editor-focus-default />
      </BlockLabel>
    </div>
  )
);

const Html: React.FC<HtmlProps> = ({ block }: HtmlProps) => (
  <div>{block.text}</div>
);

class DataAPIBlockExample extends Block {
  public static typeId = "taaas-dataapiblockexample";
  public static selectable = true;
  public static icon = icon;
  public static get label(): string {
    return t("DataAPIBlockExample");
  }

  public text = "";

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
