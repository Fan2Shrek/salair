import type { Component } from 'vue'
import { navigationConfig, type NavLink } from '~/data/navigation'

// Import des icônes
import HomeIcon from '~/components/atoms/icons/HomeIcon.vue'
import ChartIcon from '~/components/atoms/icons/ChartIcon.vue'
import FileIcon from '~/components/atoms/icons/FileIcon.vue'
import FileLinesIcon from '~/components/atoms/icons/FileLinesIcon.vue'
import BuildingIcon from '~/components/atoms/icons/BuildingIcon.vue'
import MultipleUsersIcon from '~/components/atoms/icons/MultipleUsersIcon.vue'
import UserIcon from '~/components/atoms/icons/UserIcon.vue'

const iconMap: Record<string, Component> = {
  home: HomeIcon,
  chart: ChartIcon,
  file: FileIcon,
  'file-lines': FileLinesIcon,
  building: BuildingIcon,
  users: MultipleUsersIcon,
  user: UserIcon
}

export const useNavigation = () => {
  const { t } = useI18n()
  
  const resolveIcon = (iconName: string): Component => {
    return iconMap[iconName] || FileIcon
  }
  
  const buildNavLink = (config: any): NavLink & { iconComponent: Component } => ({
    title: config.translationKey ? t(config.translationKey) : config.title,
    link: config.link,
    icon: config.icon,
    iconComponent: resolveIcon(config.icon),
    translationKey: config.translationKey
  })
  
  const homeNavLink = computed(() => buildNavLink(navigationConfig.home))
  
  const clientNavLinks = computed(() => 
    navigationConfig.client.map(config => buildNavLink(config))
  )
  
  const adminNavLinks = computed(() => 
    navigationConfig.admin.map(config => buildNavLink(config))
  )
  
  return {
    homeNavLink,
    clientNavLinks,
    adminNavLinks
  }
}
