import { Object3D } from 'three'

export async function getModelByTag(tag: string): Promise<Object3D | null> {
  const normalizedTag = tag.toLowerCase()
  const fileName = normalizedTag + '.js'
  console.log('🧩 getModelByTag:', fileName)

  try {
    const module = await import(`./htmlTagModels/${fileName}`)
    const fnName = `create${normalizedTag.charAt(0).toUpperCase()}${normalizedTag.slice(1)}Model`
    const createFn = module[fnName]
    console.log('✅ Модель знайдена:', fnName)

    if (typeof createFn === 'function') {
      return createFn()
    } else {
      console.warn(`⚠️ Функція ${fnName} не знайдена у ${fileName}`)
      return null
    }
  } catch (err) {
    console.warn(`❌ Помилка при імпорті моделі <${tag}>:`, err)
    return null
  }
}
