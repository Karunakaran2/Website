import ButtonPlayground from '../playgrounds/ButtonPlayground'
import FormPlayground from '../playgrounds/FormPlayground'
import DialogPlayground from '../playgrounds/DialogPlayground'
import TablePlayground from '../playgrounds/TablePlayground'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'

export default function PlaygroundsPage() {
  const secondaryTab = useModuleSecondaryTab('btn-playground')

  return (
    <div className="w-full space-y-6 pb-12">
      {secondaryTab === 'form-playground' ? (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Form Controls Playground</h2>
          <FormPlayground />
        </div>
      ) : secondaryTab === 'dialog-playground' ? (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Modal & Dialog Playground</h2>
          <DialogPlayground />
        </div>
      ) : secondaryTab === 'table-playground' ? (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Data Table Playground</h2>
          <TablePlayground />
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Button Component Playground</h2>
          <ButtonPlayground />
        </div>
      )}
    </div>
  )
}
