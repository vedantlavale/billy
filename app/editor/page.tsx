import { EditorShell } from "@/components/editor/editor-shell"
import InvoiceEditor from "@/components/invoice/invoice-editor"

export default function EditorPage() {
  return (
    <EditorShell>
      <InvoiceEditor />
    </EditorShell>
  )
}
