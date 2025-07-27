import { Module } from "@medusajs/framework/utils"
import SegmentService from "./service"

export const SEGMENT_MODULE = "segment"

export default Module(SEGMENT_MODULE, {
  service: SegmentService,
})