<#import "/templates/system/common/crafter.ftl" as crafter />

<#if modePreview>
  <style>
    .craftercms-ice-on .craftercms-youtube-plugin-container::before {
      content: '';
      position: absolute;
      display: inline-block;
      width: ${contentModel.width_s};
      height: ${contentModel.height_s};
    }
  </style>
</#if>

<#--       For this component we could display an image with the same dimentions and the url from `posterImage_s`  -->
<@crafter.componentRootTag class="craftercms-youtube-plugin-container">
  <#assign youtubeItemSet = contentModel.youtubeID_s?has_content />

  <#if youtubeItemSet>
    <iframe
      width="${contentModel.width_s}"
      height="${contentModel.height_s}"
      src="https://www.youtube.com/embed/${contentModel.youtubeID_s}"
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  <#elseif modePreview>
    <style>
      .crafter-youtube-no-items {
        display: none;
      }
      .craftercms-ice-on .crafter-youtube-no-items {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #808080;
        color: #fff;
        font-weight: bold;
      }
    </style>

    <@crafter.div $field=contentModel
      class="crafter-youtube-no-items"
      $attrs={
      'style': 'width: ${contentModel.width_s!"100%"}; height: ${contentModel.height_s!"300px"};'
      }
    >
      No YouTube video has been selected in the component.
    </@crafter.div>
  </#if>
</@crafter.componentRootTag>
