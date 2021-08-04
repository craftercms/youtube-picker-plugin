<#import "/templates/system/common/crafter.ftl" as crafter />

<#-- TODO: Handle page builder events to make sure the component is always editable -->
<#--       For this component we could display an image with the same dimentions and the url from `posterImage_s`  -->
<@crafter.componentRootTag>
  <iframe
     width="${contentModel.width_s}"
     height="${contentModel.height_s}"
     src="https://www.youtube.com/embed/${contentModel.youtubeID_s}"
     frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
     allowfullscreen>
  </iframe>
</@crafter.componentRootTag>
