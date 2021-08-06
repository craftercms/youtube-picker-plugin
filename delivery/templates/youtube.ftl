<#import "/templates/system/common/crafter.ftl" as crafter />

<#if modePreview>
  <style>
    .craftercms-ice-on .craftercms-youtube-plugin-container::before {
      content: '';
      position: absolute;
      display: inline-block;
      width: ${contentModel.width_s}px;
      height: ${contentModel.height_s}px;
    }
  </style>
</#if>

<#--       For this component we could display an image with the same dimentions and the url from `posterImage_s`  -->
<@crafter.componentRootTag class="craftercms-youtube-plugin-container">
  <iframe
     width="${contentModel.width_s}"
     height="${contentModel.height_s}"
     src="https://www.youtube.com/embed/${contentModel.youtubeID_s}"
     frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
     allowfullscreen>
  </iframe>
</@crafter.componentRootTag>
